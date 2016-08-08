import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { ApiConfig } from '../../api.config.ts';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

let io = require('socket.io-client');

@Injectable()
export class TestimonialService {

  public constructor(public authHttp: AuthHttp) {
  }

  public getAll(): Observable<any> {
    return this.authHttp.get(
      ApiConfig.url + '/api/testimonials', {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
      }
    );
  }


  public post(testimonial: string, anonymous: boolean): Observable<any> {
    return this.authHttp.post(
      ApiConfig.url + '/api/testimonials',
      JSON.stringify({ text: testimonial, anonymous: anonymous }), {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
  }

}
