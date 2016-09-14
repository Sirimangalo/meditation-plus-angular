import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt/angular2-jwt';
import { ApiConfig } from '../../../api.config.ts';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class BroadcastService {

  public constructor(
    public authHttp: AuthHttp
  ) {
  }

  public getAll() {
    return this.authHttp.get(
      ApiConfig.url + '/api/broadcast'
    );
  }

  public get(id: string) {
    return this.authHttp.get(
      ApiConfig.url + '/api/broadcast/' + id
    );
  }

  public save(broadcast) {
    const method = broadcast._id ? 'put' : 'post';

    return this.authHttp[method](
      ApiConfig.url + '/api/broadcast' + (broadcast._id ? '/' + broadcast._id : ''),
      broadcast, {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
  }

  public delete(broadcast) {
    return this.authHttp.delete(
      ApiConfig.url + '/api/broadcast/' + broadcast._id, {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
  }
}
