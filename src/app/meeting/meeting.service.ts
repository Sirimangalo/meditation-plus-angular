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

  public getHistory(page: number = 0, pageSize: number = 5) {
    const params = new URLSearchParams();
    params.set('page', '' + page);
    params.set('pageSize', '' + pageSize);

    return this.authHttp.get(
      ApiConfig.url + '/api/meeting/history',
      { search: params }
    );
  }

  public getNow() {
    return this.authHttp.get(
      ApiConfig.url + '/api/meeting'
    );
  }

  /**
   * Sends a message.
   *
   * @param      {string>}  meetingId  The meeting identifier
   * @param      {string}  text       The text
   */
  public sendMessage(meetingId: string, text: string) {
    return this.authHttp.post(
      ApiConfig.url + '/api/meeting/message', { meetingId, text }, {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
  }

  /**
   * Closes the meeting.
   *
   * @param      {string}  meetingId  The meeting identifier
   */
  public close(meetingId: string) {
    return this.authHttp.post(
      ApiConfig.url + '/api/meeting/close', { meetingId }, {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
  }

  /**
   * { function_description }
   *
   * @param      {string}  eventName  The name of the event
   * @param      {any}     data       The data to send
   * @param      {boolean} videochat  Whether to use the 'videochat-' or 'meeting-' prefix
   */
  public trigger(eventName: string, data: any = null, videochat: boolean = true): void {
    const websocket = this.wsService.getSocket();
    websocket.emit('meeting:' + (videochat ? 'videochat:' : '') + eventName, data);
  }

  public on(eventName: string, videochat: boolean = true): Observable<any> {
    const websocket = this.wsService.getSocket();
    return Observable.create(obs => {
      websocket.on((videochat ? 'videochat-' : 'meeting-') + eventName, res => obs.next(res));
    });
  }
}
