import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { ApiConfig } from '../../api.config.ts';
import { Headers } from '@angular/http';

@Injectable()
export class MeditationService {

  public constructor(public authHttp: AuthHttp) {
  }

  public getRecent() {
    return this.authHttp.get(
      ApiConfig.url + '/api/meditation'
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

  public like(meditation) {
    return this.authHttp.post(
      ApiConfig.url + '/api/meditation/like',
      JSON.stringify({ session: meditation._id }), {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
  }
}
