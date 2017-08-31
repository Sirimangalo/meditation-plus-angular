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
    websocket.emit('videochat:signal', data);
  }

  public message(message: string): void {
    const websocket = this.wsService.getSocket();
    websocket.emit('videochat:message', message);
  }

  public toggleMedia(audio: boolean, video: boolean): void {
    const websocket = this.wsService.getSocket();
    websocket.emit('videochat:toggledMedia', audio, video);
  }

  public reconnect(): void {
    const websocket = this.wsService.getSocket();
    websocket.emit('videochat:reconnect');
  }

  public connect(): void {
    const websocket = this.wsService.getSocket();
    websocket.emit('videochat:reconnect');
  }

  public leave(): void {
    const websocket = this.wsService.getSocket();
    websocket.emit('videochat:leave');
  }

  // Events

  public on(eventName: string): Observable<any> {
    const websocket = this.wsService.getSocket();
    return Observable.create(obs => {
      websocket.on('videochat:' + eventName, res => obs.next(res));
    });
  }
}
