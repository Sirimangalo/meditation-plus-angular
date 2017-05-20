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

  public message(message: string, isMeta: boolean = false): void {
    const websocket = this.wsService.getSocket();
    websocket.emit('videochat:message', message, isMeta);
  }

  public reconnect(): void {
    const websocket = this.wsService.getSocket();
    websocket.emit('videochat:reconnect');
  }

  public leave(): void {
    const websocket = this.wsService.getSocket();
    websocket.emit('videochat:leave');
  }

  // Events

  public onStatus(): Observable<any> {
    const websocket = this.wsService.getSocket();
    return Observable.create(obs => {
      websocket.on('videochat:status', res => obs.next(res));
    });
  }

  public onSignal(): Observable<any> {
    const websocket = this.wsService.getSocket();
    return Observable.create(obs => {
      websocket.on('videochat:signal', res => obs.next(res));
    });
  }

  public onMessage(): Observable<any> {
    const websocket = this.wsService.getSocket();
    return Observable.create(obs => {
      websocket.on('videochat:message', res => obs.next(res));
    });
  }
}
