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
    './loading-animation.css'
  ],
  providers: [VideoChatService]
})
export class VideoChatComponent implements OnInit {

  @ViewChild('localVideo', {read: ElementRef}) localVideo: ElementRef;
  @ViewChild('remoteVideo', {read: ElementRef}) remoteVideo: ElementRef;

  @Output() error: EventEmitter<Object> = new EventEmitter<Object>();
  @Output() ended: EventEmitter<Object> = new EventEmitter<Object>();

  connected: boolean;

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

  constructor(public videochatService: VideoChatService) {
    if (!SimplePeer.WEBRTC_SUPPORT) {
      this.throwError('Your browser does not support WebRTC.');
    }
  }

  throwError(errorMessage: string): void {
    this.error.emit(errorMessage);
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
      this.error.emit('Could not get stream.');
      return;
    }

    this.rtcPeer = new SimplePeer({
      initiator: this.rtcInitiator,
      stream: this.rtcStream,
      reconnectTimer: 3000
    });

    this.rtcPeer.on('signal', data => this.videochatService.signal(data));

    this.rtcPeer.on('stream', stream => {
      this.connected = true;

      // listen for interrupts
      stream.getTracks().map(track => track.onended = () => setTimeout(() => {
        if (track.readyState === 'ended') {
          this.videochatService.reconnect();
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

    this.videochatService.onStatus()
      .subscribe(status => {
        console.log(status);
        if ('connected' in status){
          this.connected = status['connected'] === true;
        }

        if ('rtcInitiator' in status) {
          this.rtcInitiator = status['rtcInitiator'] === true;
        }

        if ('message' in status){
          this.loadingMessage = status['message'];
        }

        if ('doConnect' in status && status['doConnect'] === true) {
          this.connect();
        }

        if ('doEnd' in status && status['doEnd'] === true) {
          this.ended.emit();
        }
      });

    this.videochatService.onSignal()
      .subscribe(data => {
        if (this.rtcPeer && !this.rtcPeer.destroyed) {
          this.rtcPeer.signal(data);
        }
      });

    this.videochatService.onMessage()
      .subscribe(message => this.messages.push(message));

    this.videochatService.onToggledMedia()
      .subscribe(res => {
        console.log(res);
        this.opponentCamera = res.video;
        this.opponentMic = res.audio;
      });
  }
}
