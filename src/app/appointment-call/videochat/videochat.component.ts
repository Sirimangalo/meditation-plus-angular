import { Component, ViewChild, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';
import { VideoChatService } from './videochat.service';
import * as SimplePeer from 'simple-peer';
import * as moment from 'moment';

@Component({
  selector: 'videochat',
  templateUrl: './videochat.component.html',
  styleUrls: [
    './videochat.component.styl',
    '../../message/list-entry/message-list-entry.component.styl',
    './loading-animation.css'
  ],
  providers: [VideoChatService]
})
export class VideoChatComponent implements OnInit {

  @ViewChild('localVideo', {read: ElementRef}) localVideo: ElementRef;
  @ViewChild('remoteVideo', {read: ElementRef}) remoteVideo: ElementRef;

  @Output() error: EventEmitter<Object> = new EventEmitter<Object>();
  @Output() ended: EventEmitter<Object> = new EventEmitter<Object>();

  loadingMessage: string;

  rtcInitiator: boolean;
  rtcStream; // => stream from local media devices
  rtcPeer;

  supportCamera: boolean;
  supportMic: boolean;

  cameraOn: boolean = true;
  micOn: boolean = true;

  // same properties as above only for opponent
  opponentCamera: boolean = true;
  opponentMic: boolean = true;

  currentMessage: string;
  messages: Object[] = [];

  showChat: boolean;


  joined: boolean;
  connected: boolean;

  constructor(public videochatService: VideoChatService) {
    if (!SimplePeer.WEBRTC_SUPPORT) {
      this.error.emit('Your browser does not support WebRTC.');
    }
  }

  endCall(): void {
    this.videochatService.leave();
    this.reset();
    this.ended.emit();
  }

  reset(): void {
    this.rtcInitiator = false;
    if (this.rtcPeer) this.rtcPeer.destroy();
    this.connected = false;
  }

  /**
   * Ask for media permission and then try to join appointment
   */
  getMediaPermission(video: boolean = true): void {
    navigator.mediaDevices.getUserMedia({
      video: video,
      audio: true
    }).then(
      stream => {
        this.supportCamera = video;
        this.supportMic = true;
        this.rtcStream = stream;
        this.showStream(this.localVideo.nativeElement, stream);
        this.videochatService.join();
      }, () => {
        if (video) {
          this.getMediaPermission(false);
        } else {
          this.error.emit('Could not get media permission.');
        }
      }
    );
  }

  connect(): void {
    if (!this.rtcStream) {
      this.getMediaPermission();
      this.connect();
    }

    this.connected = false;
    this.loadingMessage = 'Connecting';

    this.rtcPeer = new SimplePeer({
      initiator: this.rtcInitiator,
      stream: this.rtcStream,
      reconnectTimer: 3000
    });

    this.rtcPeer.on('signal', data => this.videochatService.signal(data));

    this.rtcPeer.on('stream', stream => {
      this.connected = true;

      // notify at the beginning if camera is disabled
      if (!this.supportCamera) {
        this.videochatService.toggleMedia(true, false);
      }

      // listen for interrupts
      stream.getTracks().map(track => track.onended = () => setTimeout(() => {
        if (track.readyState === 'ended') {
          this.connected = false;
          this.loadingMessage = 'Lost connection. Please hold on...';
          this.videochatService.connect();
        }
      }, 2000));

      this.showStream(this.remoteVideo.nativeElement, stream);
    });

    this.rtcPeer.on('error', err => {
      this.rtcPeer.destroy();
      this.error.emit('An error occurred: ' + err)
    });
  }

  /**
   * Toggles camera
   */
  toggleCamera(): void {
    if (!this.rtcStream) return;

    this.cameraOn = !this.cameraOn;

    for (let track of this.rtcStream.getVideoTracks()) {
      track.enabled = this.cameraOn;
    }

    this.videochatService.toggleMedia(this.micOn, this.cameraOn);
  }

  /**
   * Toggles microphone
   */
  toggleMicrophone(): void {
    if (!this.rtcStream) return;

    this.micOn = !this.micOn;

    for (let track of this.rtcStream.getAudioTracks()) {
      track.enabled = this.micOn;
    }

    this.videochatService.toggleMedia(this.micOn, this.cameraOn);
  }

  toggleChat(): void {
    this.showChat = !this.showChat;
  }

  /**
   * General function for displaying Media Stream inside
   * an HTML <video> element (cross browser).
   */
  showStream(elem: HTMLMediaElement, stream): void {
   if (typeof(elem.srcObject) !== 'undefined') {
      elem.srcObject = stream;
    } else {
      // use deprecated method for fallback
      elem.src = window.URL.createObjectURL(stream);
    }
  }

  sendMessage(evt) {
    if (evt) {
      evt.preventDefault()
    }

    this.videochatService.message(this.currentMessage);
    this.currentMessage = '';
  }

  formatTime(dt): String {
    return moment(dt).format('HH:mm');
  }

  ngOnInit() {
    // initiate connection process by asking for access to
    // camera and microphone first.
    this.getMediaPermission();

    this.videochatService.on('joined')
      .subscribe(() => {
        this.joined = true;
        this.videochatService.connect();
      });

    this.videochatService.on('ready')
      .subscribe(ready => {
        if (ready) {
          this.rtcInitiator = true;
          this.connect();
        } else {
          this.loadingMessage = 'Waiting for opponent to join';
          this.connected = false;
        }
      });

    this.videochatService.on('ended').subscribe(() => this.ended.emit());

    // this.videochatService.on('status')
    //   .subscribe(status => {
    //     console.log(status);
    //     if ('connected' in status){
    //       this.connected = status['connected'] === true;
    //     }

    //     if ('rtcInitiator' in status) {
    //       this.rtcInitiator = status['rtcInitiator'] === true;
    //     }

    //     if ('message' in status){
    //       this.loadingMessage = status['message'];
    //     }

    //     if ('doConnect' in status && status['doConnect'] === true) {
    //       this.connect();
    //     }

    //     if ('doEnd' in status && status['doEnd'] === true) {
    //       this.ended.emit();
    //     }
    //   });

    this.videochatService.on('signal')
      .subscribe(data => {
        if (this.rtcPeer && !this.rtcPeer.destroyed) {
          // always prefer a new connection, even if a existing
          // is already established
          if (data.type && data.type === 'offer') {
            console.log('RECEIVED OFFER');
            this.rtcInitiator = false;
            this.connect();
          } else {
            this.rtcPeer.signal(data);
          }
        }
      });

    this.videochatService.on('message').subscribe(message => this.messages.push(message));

    this.videochatService.on('toggleMedia')
      .subscribe(res => {
        console.log(res);
        this.opponentCamera = res.video;
        this.opponentMic = res.audio;
      });
  }
}
