import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { ApiConfig } from '../../api.config.ts';
import { Headers } from '@angular/http';

@Injectable()
export class CommitmentService {

  public constructor(public authHttp: AuthHttp) {
  }

  public getAll() {
    return this.authHttp.get(
      ApiConfig.url + '/api/commitment'
    );
  }

  public commit(commitment) {
    return this.authHttp.post(
      ApiConfig.url + '/api/commitment/' + commitment._id + '/commit',
      null, {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
  }

  public uncommit(commitment) {
    return this.authHttp.post(
      ApiConfig.url + '/api/commitment/' + commitment._id + '/uncommit',
      null, {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
  }
}
