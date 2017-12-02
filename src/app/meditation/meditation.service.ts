import { Injectable } from '@angular/core';
import { AuthHttp } from '../shared/auth-http.service';
import { ApiConfig } from '../../api.config';
import { Headers } from '@angular/http';
import { WebsocketService } from '../shared';
import { Observable } from 'rxjs/Observable';

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

  public getChartData() {
    return this.authHttp.get(
      ApiConfig.url + '/api/meditation/chart'
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
    const websocket = this.wsService.getSocket();

    return Observable.create(obs => {
      websocket.on('meditation', res => obs.next(res));
    });
  }
}
