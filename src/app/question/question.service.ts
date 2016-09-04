import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt/angular2-jwt';
import { ApiConfig } from '../../api.config.ts';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

let io = require('socket.io-client');

@Injectable()
export class QuestionService {

  public constructor(public authHttp: AuthHttp) {
  }

  public getQuestions(): Observable<any> {
    return this.authHttp.get(
      ApiConfig.url + '/api/question'
    );
  }

  public post(question: string): Observable<any> {
    return this.authHttp.post(
      ApiConfig.url + '/api/question',
      JSON.stringify({ text: question }), {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
  }

  public like(question): Observable<any> {
    return this.authHttp.post(
      ApiConfig.url + '/api/question/' + question._id + '/like',
      '', {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
  }

  public delete(question): Observable<any> {
    return this.authHttp.delete(
      ApiConfig.url + '/api/question/' + question._id, {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
  }

  public answer(question): Observable<any> {
    return this.authHttp.post(
      ApiConfig.url + '/api/question/' + question._id + '/answer',
      '', {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
  }

  /**
   * Initializes Socket.io client with Jwt and listens to 'question'.
   */
  public getSocket(): Observable<any> {
    let websocket = io(ApiConfig.url, {
      transports: ['websocket'],
      query: 'token=' + window.localStorage.getItem('id_token')
    });

    return Observable.create(obs => {
      websocket.on('question', res => obs.next(res));

      return () => {
        websocket.close();
      };
    });
  }
}
