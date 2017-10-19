import { Injectable } from '@angular/core';
import { WebsocketService } from '../../shared';
import { Observable } from 'rxjs/Observable';

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
    websocket.emit('appointment:toggleMedia', { audio, video });
  }

  public ready(initiator: boolean = false): void {
    const websocket = this.wsService.getSocket();
    websocket.emit('appointment:ready', initiator);
  }

  public leave(gracefully = true): void {
    const websocket = this.wsService.getSocket();
    websocket.emit('appointment:leave', gracefully);
  }

  // Events

  public on(eventName: string): Observable<any> {
    const websocket = this.wsService.getSocket();
    return Observable.create(obs => {
      websocket.on('appointment:' + eventName, res => obs.next(res));
    });
  }
}
