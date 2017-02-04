import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt/angular2-jwt';
import { ApiConfig } from '../../api.config';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class TestimonialService {

  public constructor(public authHttp: AuthHttp) {
  }

  public getAll(): Observable<any> {
    return this.authHttp.get(
      ApiConfig.url + '/api/testimonial', {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
      }
    );
  }

  public getAllAdmin(): Observable<any> {
    return this.authHttp.get(
      ApiConfig.url + '/api/testimonial/admin', {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
      }
    );
  }

  public post(testimonial: string, anonymous: boolean): Observable<any> {
    return this.authHttp.post(
      ApiConfig.url + '/api/testimonial',
      JSON.stringify({ text: testimonial, anonymous: anonymous }), {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
  }

  public toggleReviewed(testimonialId: string): Observable<any> {
    return this.authHttp.put(
      ApiConfig.url + '/api/testimonial/review',
      JSON.stringify({ id : testimonialId }), {
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      }
    );
  }

  public delete(testimonial) {
    return this.authHttp.delete(
      ApiConfig.url + '/api/testimonial/' + testimonial._id, {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
  }

}
