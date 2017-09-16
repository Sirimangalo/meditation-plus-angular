import { Injectable } from '@angular/core';
import { WebsocketService } from '../../shared';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class VideoChatService {

  public constructor(public wsService: WebsocketService) { }

  // Actions

  public join(): void {
    const websocket = this.wsService.getSocket();
    websocket.emit('appointment', true);
  }

  public signal(data): void {
    const websocket = this.wsService.getSocket();
    websocket.emit('appointment:signal', data);
  }

  public message(message: string): void {
    const websocket = this.wsService.getSocket();
    websocket.emit('appointment:message', message);
  }

  public toggleMedia(audio: boolean, video: boolean): void {
    const websocket = this.wsService.getSocket();
    websocket.emit('appointment:toggledMedia', audio, video);
  }

  public reconnect(): void {
    const websocket = this.wsService.getSocket();
    websocket.emit('appointment:reconnect');
  }

  public ready(): void {
    const websocket = this.wsService.getSocket();
    websocket.emit('appointment:ready');
  }

  public leave(): void {
    const websocket = this.wsService.getSocket();
    websocket.emit('appointment:leave');
  }

  // Events

  public on(eventName: string): Observable<any> {
    const websocket = this.wsService.getSocket();
    return Observable.create(obs => {
      websocket.on('appointment:' + eventName, res => obs.next(res));
    });
  }
}
