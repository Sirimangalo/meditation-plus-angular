import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt/angular2-jwt';
import { ApiConfig } from '../../api.config.ts';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { WebsocketService } from '../shared';

@Injectable()
export class MeditationService {

  public constructor(
    public authHttp: AuthHttp,
    public wsService: WebsocketService
  ) {
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

  public post(walking: number, sitting: number, start = null) {
    return this.authHttp.post(
      ApiConfig.url + '/api/meditation',
      JSON.stringify({ walking, sitting, start }), {
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
    let websocket = this.wsService.getSocket();

    return Observable.create(obs => {
      websocket.on('meditation', res => obs.next(res));
    });
  }
}
