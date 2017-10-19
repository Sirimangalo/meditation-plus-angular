import { Injectable } from '@angular/core';
import { AuthHttp } from '../shared/auth-http.service';
import { ApiConfig } from '../../api.config';
import { Headers, URLSearchParams } from '@angular/http';
import { WebsocketService } from '../shared';
import { Message } from './message';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MessageService {

  public constructor(
    public authHttp: AuthHttp,
    public wsService: WebsocketService
  ) {
  }

  public getRecent(page = 0): Observable<any> {
    const params = new URLSearchParams();
    params.set('page', '' + page);

    return this.authHttp.get(
      ApiConfig.url + '/api/message',
      { search: params }
    );
  }

  public post(message: string): Observable<any> {
    return this.authHttp.post(
      ApiConfig.url + '/api/message',
      JSON.stringify({ text: message }), {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
  }

  public update(message: Message): Observable<any> {
    return this.authHttp.put(
      ApiConfig.url + '/api/message/' + message._id,
      JSON.stringify({ text: message.text }), {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
  }

  public delete(message: Message): Observable<any> {
    return this.authHttp.delete(
      ApiConfig.url + '/api/message/' + message._id, {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
  }

  public synchronize(timeFrameStart: Date, timeFrameEnd: Date, countOnly: Boolean = false): Observable<any> {
    return this.authHttp.post(
      ApiConfig.url + '/api/message/synchronize',
      JSON.stringify({ timeFrameStart, timeFrameEnd, countOnly}), {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
  }

  public getUpdateSocket(): Observable<any> {
    const websocket = this.wsService.getSocket();
    return Observable.create(obs => {
      websocket.on('message-update', res => obs.next(res));
    });
  }

  /**
   * Save the datetime last received message to local storage
   */
  public setLastMessage(messageDate) {
    return window.localStorage.setItem('lastMessage', messageDate);
  }

  /**
   * Get the datetime last received message from local storage
   */
  public getLastMessage() {
    return window.localStorage.getItem('lastMessage');
  }
}
