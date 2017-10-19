import { Injectable } from '@angular/core';
import { Request, Response, RequestOptionsArgs } from '@angular/http';
import { Router } from '@angular/router';
import { AuthHttp as JwtAuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';

@Injectable()
export class AuthHttp {
  constructor(private authHttp: JwtAuthHttp, private router: Router) {
  }

  private isUnauthorized(status: number): boolean {
    return status === 401;
  }

  private authIntercept(response: Observable<Response>): Observable<Response> {
    return response.do(null, err => {
      if (this.isUnauthorized(err.status)) {
        this.router.navigate(['/login']);
      }
    });
  }

  public setGlobalHeaders(headers: Array<Object>, request: Request | RequestOptionsArgs) {
    this.authHttp.setGlobalHeaders(headers, request);
  }

  public request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    return this.authIntercept(this.authHttp.request(url, options));
  }

  public get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.authIntercept(this.authHttp.get(url, options));
  }

  public post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    return this.authIntercept(this.authHttp.post(url, body, options));
  }

  public put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    return this.authIntercept(this.authHttp.put(url, body, options));
  }

  public delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.authIntercept(this.authHttp.delete(url, options));
  }

  public patch(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    return this.authIntercept(this.authHttp.patch(url, body, options));
  }

  public head(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.authIntercept(this.authHttp.head(url, options));
  }

  public options(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.authIntercept(this.authHttp.options(url, options));
  }
}
