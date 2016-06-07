import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { ApiConfig } from '../../api.config.ts';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

let io = require('socket.io-client');

@Injectable()
export class MessageService {

  public constructor(public authHttp: AuthHttp) {
  }

  public getRecent(): Observable<any> {
    return this.authHttp.get(
      ApiConfig.url + '/api/message'
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

  /**
   * Initializes Socket.io client with Jwt and listens to 'message'.
   */
  public getSocket(): Observable<any> {
    let websocket = io(ApiConfig.url, {
      query: 'token=' + window.localStorage.getItem('id_token')
    });
    return Observable.fromEvent(websocket, 'message');
  }
}
