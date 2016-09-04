import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt/angular2-jwt';
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

  public get(id: string) {
    return this.authHttp.get(
      ApiConfig.url + '/api/commitment/' + id
    );
  }

  public save(commitment) {
    const method = commitment._id ? 'put' : 'post';

    return this.authHttp[method](
      ApiConfig.url + '/api/commitment' + (commitment._id ? '/' + commitment._id : ''),
      commitment, {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
  }

  public commit(commitment) {
    return this.authHttp.post(
      ApiConfig.url + '/api/commitment/' + commitment._id + '/commit',
      '', {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
  }

  public uncommit(commitment) {
    return this.authHttp.post(
      ApiConfig.url + '/api/commitment/' + commitment._id + '/uncommit',
      '', {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
  }

  public delete(commitment) {
    return this.authHttp.delete(
      ApiConfig.url + '/api/commitment/' + commitment._id, {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
  }

}
