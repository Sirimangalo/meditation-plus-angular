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
import * as SimplePeer from 'simple-peer';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'videochat',
  templateUrl: './videochat.component.html',
  styleUrls: [
    './videochat.component.styl',
    '../../message/list-entry/message-list-entry.component.styl',
    './loading-animation.css'
  ]
})
export class VideoChatComponent implements OnInit, OnDestroy {
  @Input() meeting: any;
  @Input() preview: boolean = false;

  @Output() error: EventEmitter<any> = new EventEmitter<any>();
  @Output() ended: EventEmitter<any> = new EventEmitter<any>();
  @Output() previewEnded: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('localVideo', {read: ElementRef}) localVideo: ElementRef;
  @ViewChild('remoteVideo', {read: ElementRef}) remoteVideo: ElementRef;

  // required parameter for initiating peer connection.
  // Opponent needs to have different value for it.
  rtcInitiator: boolean;

  // stream from local webcam
  rtcStream;

  // SimplePeer Object
  rtcPeer;

  connected: boolean;
  loadingMessage = 'Initializing';

  cameraSupport: boolean;
  micSupport: boolean;

  // own status
  cameraOn = true;
  micOn = true;

  // same properties as above only for opponent
  opponentCameraOn = true;
  opponentMicOn = true;

  showChat = true;
  missedMessages = 0;
  currentMessage: string;
  messages: any[] = [];

  checkStream: Subscription;

  constructor(public meetingService: MeetingService) { }

  get userId() {
    return window.localStorage.getItem('id');
  }

  /**
   * Exit the video call.
   *
   * @param {boolean} gracefully Param indicating whether call was ended
   *                             on purpose.
   */
  exit(gracefully = true): void {
    // destroy RTC object
    if (this.rtcPeer) {
      this.rtcPeer.destroy();
      this.rtcPeer = null;
    }

    // stop stream from local webcam
    if (this.rtcStream) {
      this.rtcStream.getTracks().map(track => track.stop());
    }

    this.meetingService.trigger('leave', gracefully);

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
    if (!this.rtcStream) {
      return this.error.emit('No webcam stream found. Please try again or use Google Hangouts.');
    }

    // unsubscribe old stream check
    if (this.checkStream) {
      this.checkStream.unsubscribe();
    }

    // update UI
    this.connected = false;
    this.loadingMessage = 'Connecting';

    // create new RTC connection
    this.rtcPeer = new SimplePeer({
      initiator: this.rtcInitiator,
      stream: this.rtcStream,
      reconnectTimer: 3000
    });

    // send signalling data to opponent
    this.rtcPeer.on('signal', data => this.meetingService.trigger('signal', data));

    // change loading message if connected
    this.rtcPeer.on('connect', () => this.loadingMessage = 'Connected. Waiting for stream.');

    // establish videochat
    this.rtcPeer.on('stream', stream => {
      this.connected = true;

      // notify at the beginning if camera is disabled
      this.meetingService.trigger('media', {
        audio: this.micSupport && this.micOn,
        video: this.cameraSupport && this.cameraOn
      });

      // listen for interrupts
      this.checkStream = Observable.interval(1500)
        .subscribe(() => {
          if (!stream.active) {
            this.connected = false;
            this.loadingMessage = 'Connection interrupted. Waiting for reconnect.';
          }
        });

      // show stream in DOM
      this.showStream(this.remoteVideo.nativeElement, stream);
    });

    this.rtcPeer.on('error', err => {
      if (!this.rtcPeer.destroyed) {
        this.connected = false;
        this.rtcPeer.destroy();
        this.error.emit('An error occurred: ' + err);
      }
    });
  }

  /**
   * Toggles camera
   */
  toggleCamera(): void {
    if (!this.rtcStream) {
      return;
    }

    this.cameraOn = !this.cameraOn;

    for (const track of this.rtcStream.getVideoTracks()) {
      track.enabled = this.cameraOn;
    }

    this.meetingService.trigger('media', {
      audio: this.micOn,
      video: this.cameraOn
    });
  }

  /**
   * Toggles microphone
   */
  toggleMicrophone(): void {
    if (!this.rtcStream) {
      return;
    }

    this.micOn = !this.micOn;

    for (const track of this.rtcStream.getAudioTracks()) {
      track.enabled = this.micOn;
    }

    this.meetingService.trigger('media', {
      audio: this.micOn,
      video: this.cameraOn
    });
  }

  /**
   * Toggles chat interface
   */
  toggleChat(): void {
    this.showChat = !this.showChat;
    this.missedMessages = 0;
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
   * Send a message to opponent.
   *
   * @param {any} evt  DOM Event
   */
  sendMessage(evt: any = null) {
    if (evt) {
      evt.preventDefault();
    }

    this.meetingService
      .sendMessage(this.currentMessage)
      .subscribe(() => this.currentMessage = '');
  }

  /**
   * Shows stream from local webcam in browser and joins appointment
   * socket connection.
   *
   * @param {MediaStream} stream  Stream from local camera/audio
   * @param {boolean}     video   Whether local stream supports webcam
   */
  initialize(stream: MediaStream, video: boolean = true): void {
    this.cameraSupport = video;
    this.cameraOn = video;
    this.micSupport = true;
    this.rtcStream = stream;

    this.showStream(this.localVideo.nativeElement, stream);
    this.meetingService.trigger('join');
  }

  /**
   * Method for improving performance for iterating with ngFor
   */
  trackById(index, item) {
    return item._id;
  }

  /**
   * Stops the preview of an old meeting
   */
  stopPreview(): void {
    this.previewEnded.emit();
  }

  ngOnInit(): void {
    this.messages = this.meeting.messages;

    if (this.preview) {
      this.loadingMessage = 'Preview Mode';
      return;
    }

    if (!SimplePeer.WEBRTC_SUPPORT) {
      this.error.emit('Your browser does not support WebRTC. Please use Google Hangouts instead.');
    }

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

    this.meetingService.on('error').subscribe(errMsg => this.error.emit(errMsg));

    /**
     * Event for when client has joined conference room in socket.io
     */
    this.meetingService.on('joined').subscribe(() => {
      console.log('joined');
      this.loadingMessage = 'Waiting for opponent to join';
      this.connected = false;

      // tests have shown that it works better if a participant
      // with webcam initiates the call. If the opponent has only
      // audio sometimes the own image was not transmitted.
      this.meetingService.trigger('ready', this.cameraSupport);
    });

    /**
     * Event for getting initiator value and start connecting if possible
     */
    this.meetingService.on('ready')
      .subscribe(initiator => {
        console.log('ready', initiator);
        this.rtcInitiator = initiator;
        this.connect();
      });

    /**
     * Event for getting signals from remote peer
     */
    this.meetingService.on('signal')
      .subscribe(data => {
        if (this.rtcPeer && !this.rtcPeer.destroyed) {
          this.rtcPeer.signal(data);
        }
      });

    /**
     * Event for retrieving chat messages
     */
    this.meetingService.on('message').subscribe(message => {
      this.messages.push(message);

      if (!this.showChat) {
        this.missedMessages++;
      }
    });

    /**
     * Event for getting status of opponent's webcam and microphone
     */
    this.meetingService.on('media')
      .subscribe(res => {
        this.opponentCameraOn = res.video === true;
        this.opponentMicOn = res.audio === true;
      });

    /**
     * Event for detecting disconnect of opponent or the ending
     * of the call
     */
    this.meetingService.on('ended').subscribe(gracefully => {
      if (gracefully) {
        this.exit(true);
      } else {
        this.loadingMessage = 'Opponent left unexpected. Waiting for reconnect.';
      }
    });
  }

  ngOnDestroy(): void {
    if (this.checkStream) {
      this.checkStream.unsubscribe();
    }

    this.exit(false);
  }
}
