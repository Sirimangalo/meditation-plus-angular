import { Injectable } from '@angular/core';
import { AuthHttp } from '../shared/auth-http.service';
import { ApiConfig } from '../../api.config';
import { Headers, URLSearchParams } from '@angular/http';
import { WebsocketService } from '../shared';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class MeetingService {

  public constructor(
    public authHttp: AuthHttp,
    public wsService: WebsocketService
 ) { }

  public getAll(page: number = 0, pageSize: number = 5) {
    const params = new URLSearchParams();
    params.set('page', '' + page);
    params.set('pageSize', '' + pageSize);

    return this.authHttp.get(
      ApiConfig.url + '/api/meeting',
      { search: params }
    );
  }

  public getNow() {
    return this.authHttp.get(
      ApiConfig.url + '/api/meeting/now'
    );
  }

  getAppointment() {
    return this.authHttp.get(
      ApiConfig.url + '/api/meeting/appointment'
    );
  }

  join() {
    return this.authHttp.post(
      ApiConfig.url + '/api/meeting/join', {}, {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
  }

  public sendMessage(text: string) {
    return this.authHttp.post(
      ApiConfig.url + '/api/meeting/message', { text }, {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
  }

  public trigger(eventName, data: any = null): void {
    const websocket = this.wsService.getSocket();
    websocket.emit('meeting:' + eventName, data);
  }

  public on(eventName: string): Observable<any> {
    const websocket = this.wsService.getSocket();
    return Observable.create(obs => {
      websocket.on('meeting-' + eventName, res => obs.next(res));
    });
  }
}
