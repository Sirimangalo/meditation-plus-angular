import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { ApiConfig } from '../../api.config.ts';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

let io = require('socket.io-client');

@Injectable()
export class MeditationService {

  public constructor(public authHttp: AuthHttp) {
  }

  public getRecent() {
    return this.authHttp.get(
      ApiConfig.url + '/api/meditation'
    );
  }

  public getTimes() {
    return this.authHttp.get(
      ApiConfig.url + '/api/meditation/times'
    );
  }

  public post(walking: number, sitting: number) {
    return this.authHttp.post(
      ApiConfig.url + '/api/meditation',
      JSON.stringify({ walking, sitting }), {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
  }

  public stop() {
    return this.authHttp.post(
      ApiConfig.url + '/api/meditation/stop',
      '', {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
  }

  public like() {
    return this.authHttp.post(
      ApiConfig.url + '/api/meditation/like',
      '', {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
  }

  /**
   * Initializes Socket.io client with Jwt and listens to 'meditation'.
   */
  public getSocket(): Observable<any> {
    let websocket = io(ApiConfig.url, {
      transports: ['websocket'],
      query: 'token=' + window.localStorage.getItem('id_token')
    });

    return Observable.create(obs => {
      websocket.on('meditation', res => obs.next(res));

      return () => {
        websocket.close();
      };
    });
  }
}
