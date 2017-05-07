import { Injectable } from '@angular/core';
import { Http, Request, Response, RequestOptionsArgs } from '@angular/http';
import { Router } from '@angular/router';
import { AuthHttp as JwtAuthHttp, AuthConfig } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthHttp extends JwtAuthHttp {
  constructor(options: AuthConfig, http: Http, private _router: Router) {
    super(options, http);
  }

  _isUnauthorized(status: number): boolean {
    return status === 401;
  }

  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    return super.request(url, options).do(null, err => {
      if (this._isUnauthorized(err.status)) {
        this._router.navigate(['/login']);
      }
    });
  }
}
