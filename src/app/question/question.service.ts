import { Injectable } from '@angular/core';
import { AuthHttp } from '../shared/auth-http.service';
import { ApiConfig } from '../../api.config';
import { Headers, URLSearchParams } from '@angular/http';
import { WebsocketService } from '../shared';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class QuestionService {

  public constructor(
    public authHttp: AuthHttp,
    public wsService: WebsocketService
  ) {
  }

  public getQuestions(
    filterAnswered = false,
    page = 0,
    searchParams = null
  ): Observable<any> {
    const params = new URLSearchParams();
    params.set('filterAnswered', filterAnswered ? 'true' : 'false');
    params.set('page', '' + page);

    if (searchParams) {
      Object.keys(searchParams).map(p => params.set(p, searchParams[p].toString()));
    }

    return this.authHttp.get(
      ApiConfig.url + '/api/question',
      { search: params }
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

  public answering(question): Observable<any> {
    return this.authHttp.post(
      ApiConfig.url + '/api/question/' + question._id + '/answering',
      '', {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
  }

  public unanswering(question): Observable<any> {
    return this.authHttp.post(
      ApiConfig.url + '/api/question/' + question._id + '/unanswering',
      '', {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
  }


  public findSuggestions(question: string): Observable<any> {
    return this.authHttp.post(
      ApiConfig.url + '/api/question/suggestions',
      JSON.stringify({ text: question }), {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
  }

  public getCount(): Observable<any> {
    return this.authHttp.get(
      ApiConfig.url + '/api/question/count'
    );
  }

  /**
   * Initializes Socket.io client with Jwt and listens to 'question'.
   */
  public getSocket(): Observable<any> {
    const websocket = this.wsService.getSocket();

    return Observable.create(obs => {
      websocket.on('question', res => obs.next(res));
    });
  }
}
