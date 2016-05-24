import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { ApiConfig } from '../../api.config.ts';
import { Headers } from '@angular/http';

@Injectable()
export class MessageService {

  public constructor(public authHttp: AuthHttp) {
  }

  public getRecent() {
    return this.authHttp.get(
      ApiConfig.url + '/api/message'
    );
  }

  public post(message: string) {
    return this.authHttp.post(
      ApiConfig.url + '/api/message',
      JSON.stringify({ text: message }), {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
  }
}
