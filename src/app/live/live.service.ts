import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { ApiConfig } from '../../api.config.ts';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class LiveService {

  public constructor(public authHttp: AuthHttp) {
  }

  public getLiveData() {
    return this.authHttp.get(
      ApiConfig.url + '/api/live'
    );
  }
}
