import { Subscription } from 'rxjs/Subscription';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { MeetingService } from '../meeting.service';
import { Meeting } from '../meeting';
import * as SimplePeer from 'simple-peer';
import { Observable } from 'rxjs/Observable';
import { VideochatData, VideochatMedia, VC_STATE } from './videochat';

@Component({
  selector: 'meeting-videochat',
  templateUrl: './videochat.component.html',
  styleUrls: [
    './videochat.component.styl',
    '../../message/list-entry/message-list-entry.component.styl',
    './loading-animation.css'
  ]
})
export class VideoChatComponent implements OnInit, OnDestroy {
  // for use in template, see https://github.com/angular/angular/issues/2885#issuecomment-118666187
  public VC_STATE = VC_STATE;

  @Input() meeting: Meeting;

  @Output() error: EventEmitter<any> = new EventEmitter<any>();
  @Output() ended: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('localVideo', {read: ElementRef}) localVideo: ElementRef;
  @ViewChild('remoteVideo', {read: ElementRef}) remoteVideo: ElementRef;

  state: VideochatData;
  checkStream: Subscription;

  constructor(public meetingService: MeetingService) {
    this.state = {
      status: VC_STATE.INIT,
      loadingMessage: 'Initializing'
    };

    if (!SimplePeer.WEBRTC_SUPPORT) {
      this.error.emit('Your browser does not support WebRTC. Please use Google Hangouts instead.');
    }

    this.meetingService.on('error').subscribe(errMsg => this.error.emit(errMsg));

    /**
     * Event for when client has joined conference room in socket.io
     */
    this.meetingService.on('joined').subscribe(() => {
      if (this.state.status >= VC_STATE.JOINED) {
        return;
      }

      this.state.status = VC_STATE.JOINED;
      this.state.loadingMessage = 'Waiting for opponent to join';
      this.meetingService.trigger('ready', this.meeting._id);
    });

    /**
     * Event for receiving signal that all participants are ready to call
     */
    this.meetingService.on('ready')
      .subscribe(() => {
        if (this.state.status !== VC_STATE.JOINED) {
          return;
        }

        this.state.status = VC_STATE.READY;
        this.state.initiator = this.state.media.available.cam;

        this.meetingService.trigger('negotiate_request', {
          meetingId: this.meeting._id,
          // tests have shown that it works better if a participant
          // with webcam initiates the call. If the opponent has only
          // audio sometimes the own image was not transmitted.
          initiatorProposal: this.state.initiator
        });
      });

    /**
     * Using a (sort of) three way handshake for negotiating whose gonna be
     * the initiator of the WebRTC connection.
     */

    this.meetingService.on('negotiate_request')
      .subscribe(initiatorProposal => {
        let accepted;

        // Case: Opponent wants to reconnect.
        // => Tell him to be the same role as on first connect
        // to not mess up existing RTC state.
        if (this.state.status >= VC_STATE.NEGOTIATED) {
          accepted = initiatorProposal !== this.state.initiator;
        } else {
          accepted = true;
          this.state.initiator = !initiatorProposal;
        }

        this.meetingService.trigger('negotiate_response', {
          meetingId: this.meeting._id,
          accepted: accepted
        });
      });

    this.meetingService.on('negotiate_response')
      .subscribe(accepted => {
        if (this.state.status >= VC_STATE.NEGOTIATED) {
          return;
        }

        this.state.initiator = accepted ? this.state.initiator : !this.state.initiator;
        this.meetingService.trigger('negotiate_confirm', this.meeting._id);
      });

    this.meetingService.on('negotiate_confirmed')
      .subscribe(() => {
        if (this.state.status >= VC_STATE.CONNECTED) {
          return;
        }

        this.state.status = VC_STATE.NEGOTIATED;
        this.connect();
      });

    /**
     * Event for getting signals from remote peer
     */
    this.meetingService.on('signal')
      .subscribe(data => {
        if (this.state.status < VC_STATE.CONNECTING) {
          return;
        }

        if (this.state.peer && !this.state.peer.destroyed) {
          this.state.peer.signal(data);
        }
      });

    /**
     * Event for getting status of opponent's webcam and microphone
     */
    this.meetingService.on('media')
      .subscribe((media: VideochatMedia) => {
        if (this.state.status < VC_STATE.CONNECTING) {
          return;
        }

        this.state.oppMedia = media;
      });

    /**
     * Event for detecting disconnect of opponent or the ending
     * of the call
     */
    this.meetingService.on('ended').subscribe(gracefully => {
      // if (this.state.status <= VC_STATE.CONNECTED) {
      //   return;
      // }
      if (gracefully) {
        this.exit(true);
      } else {
        this.state.loadingMessage = 'Opponent left unexpected. Waiting for reconnect.';
      }
    });
  }

  /**
   * Exit the video call.
   *
   * @param {boolean} gracefully Param indicating whether call was ended
   *                             on purpose.
   */
  exit(gracefully: boolean = true): void {
    // destroy RTC object
    if (this.state.peer) {
      this.state.peer.destroy();
      this.state.peer = null;
    }

    // stop stream from local webcam
    if (this.state.localStream) {
      this.state.localStream.getTracks().map(track => track.stop());
    }

    this.meetingService.trigger('leave', {
      meetingId: this.meeting._id,
      gracefully: gracefully
    });

    if (gracefully) {
      this.ended.emit();
    }
  }

  /**
   * Aquire permission for using microphone and/or webcam in browser.
   *
   * @param  {boolean}      video  Whether or not to ask for permission
   *                               to access webcam.
   * @return {Promise<any>}        Browser's promise
   */
  getMediaPermission(video: boolean = true): Promise<any> {
    return navigator.mediaDevices.getUserMedia({
      video: video,
      audio: true
    });
  }

  /**
   * Start WebRTC connection. This method opens a P2P WebRTC connection
   * for transmitting video and audio between both participants.
   */
  connect(): void {
    if (this.state.status !== VC_STATE.NEGOTIATED) {
      return;
    }

    if (!this.state.localStream) {
      return this.error.emit('No webcam/mic stream found. Please try again or use Google Hangouts.');
    }

    // unsubscribe old stream check
    if (this.checkStream) {
      this.checkStream.unsubscribe();
    }

    this.state.status = VC_STATE.CONNECTING;
    this.state.loadingMessage = 'Connecting';

    // create new RTC connection
    this.state.peer = new SimplePeer({
      initiator: this.state.initiator,
      stream: this.state.localStream,
      reconnectTimer: 3000
    });

    // send signalling data to opponent
    this.state.peer.on('signal', data => {
      if (!this.state.peer) {
        return;
      }

      this.meetingService.trigger('signal', {
        meetingId: this.meeting._id,
        signal: data
      });
    });

    // change loading message if connected
    this.state.peer.on('connect', () => this.state.loadingMessage = 'Connected. Waiting for stream.');

    // establish videochat
    this.state.peer.on('stream', stream => {
      if (!this.state.peer) {
        return;
      }

      // notify at the beginning if camera is disabled
      this.meetingService.trigger('media', {
        meetingId: this.meeting._id,
        media: this.state.media
      });

      // listen for interrupts
      this.checkStream = Observable.interval(1500)
        .subscribe(() => {
          if (!stream.active) {
            this.state.status = VC_STATE.NEGOTIATED;
            this.state.loadingMessage = 'Connection interrupted. Waiting for reconnect.';
          }
        });

      // show stream in DOM
      this.state.status = VC_STATE.CONNECTED;
      this.showStream(this.remoteVideo.nativeElement, stream);
    });

    this.state.peer.on('error', err => {
      if (!this.state.peer && !this.state.peer.destroyed) {
        this.state.peer.destroy();
      }

      this.error.emit('An error occurred: ' + err);
    });
  }

  /**
   * Toggles camera
   */
  toggleCamera(): void {
    if (!this.state.localStream || !this.state.media) {
      return;
    }

    this.state.media.active.cam = !this.state.media.active.cam;
    for (const track of this.state.localStream.getVideoTracks()) {
      track.enabled = this.state.media.active.cam;
    }

    this.meetingService.trigger('media', {
      meetingId: this.meeting._id,
      media: this.state.media
    });
  }

  /**
   * Toggles microphone
   */
  toggleMicrophone(): void {
    if (!this.state.localStream || !this.state.media) {
      return;
    }

    this.state.media.active.mic = !this.state.media.active.mic;
    for (const track of this.state.localStream.getAudioTracks()) {
      track.enabled = this.state.media.active.mic;
    }

    this.meetingService.trigger('media', {
      meetingId: this.meeting._id,
      media: this.state.media
    });
  }

  /**
   * General function for displaying Media Stream inside
   * an HTML <video> element (cross browser support).
   *
   * @param {HTMLMediaElement} elem    HTML video element
   * @param {any}              stream  Media stream
   */
  showStream(elem: HTMLMediaElement, stream: any): void {
   if (typeof(elem.srcObject) !== 'undefined') {
      elem.srcObject = stream;
    } else {
      // use deprecated method for fallback
      elem.src = window.URL.createObjectURL(stream);
    }
  }

  /**
   * Shows stream from local webcam in browser and joins appointment
   * socket connection.
   *
   * @param {MediaStream} stream  Stream from local camera/audio
   * @param {boolean}     video   Whether local stream supports webcam
   */
  initialize(stream: MediaStream, video: boolean = true): void {
    if (!this.meeting) {
      this.error.emit('No meeting object found.');
    }

    this.state.media = {
      available: {
        cam: video,
        mic: true
      },
      active:  {
        cam: video,
        mic: true
      }
    };

    this.state.localStream = stream;
    this.showStream(this.localVideo.nativeElement, this.state.localStream);
    this.meetingService.trigger('join', this.meeting._id);
  }

  ngOnInit(): void {
    // initiate connection process by asking for access to
    // camera and/or microphone first.
    this.getMediaPermission(true)
      .then(
        stream => this.initialize(stream),
        // second try with microphone only
        () => this.getMediaPermission(false)
          .then(
            stream => this.initialize(stream, false),
            () => this.error.emit('Could not get media permission.')
          )
      );
  }

  ngOnDestroy(): void {
    if (this.checkStream) {
      this.checkStream.unsubscribe();
    }

    this.exit(false);
  }
}
