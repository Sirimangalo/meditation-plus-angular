import { Injectable } from '@angular/core';
import { AuthHttp } from './auth-http.service';
import { ApiConfig } from '../../api.config';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class SettingsService {

  public constructor(
    public authHttp: AuthHttp
  ) {
  }

  public get() {
    return this.authHttp.get(
      ApiConfig.url + '/api/settings'
    );
  }

  public set(property: string, value: any) {
    return this.authHttp.put(
      ApiConfig.url + '/api/settings/' + property,
      { value }, {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
  }
}
