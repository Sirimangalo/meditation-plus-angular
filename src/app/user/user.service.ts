import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { ApiConfig } from '../../api.config';
import { AuthHttp } from 'angular2-jwt';

@Injectable()
export class UserService {

  url: string = ApiConfig.url;

  public constructor(
    public http: Http,
    public authHttp: AuthHttp
  ) {
  }

  /**
   * Logging in a User via username and password.
   * @param {String} username
   * @param {String} password
   */
  public login(username: string, password: string) {
    let observable = this.http.post(
      this.url + '/auth/login',
      JSON.stringify({username, password}), {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    })
    .share();

    observable.subscribe(
      res => {
        window.localStorage.setItem('id_token', (<any>res.json()).token);
        window.localStorage.setItem('id', (<any>res.json()).id);
        window.localStorage.setItem('username', username);
      },
      err => {
        console.error(err);
      }
    );

    return observable;
  }

  public signup(username: String, password: String, email: String) {
    let observable = this.http.post(
      this.url + '/auth/signup',
      JSON.stringify({username, password, email}), {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });

    return observable;
  }

  /**
   * Logging out the current user. Removes the token from
   * localStorage.
   */
  public logout(): void {
    window.localStorage.removeItem('id_token');
    window.localStorage.removeItem('id');
    window.localStorage.removeItem('username');
    this.http.post(
      this.url + '/auth/logout',
      ''
    ).subscribe(() => {});
  }

  /**
   * Asks the server if we are logged in.
   */
  public loggedIn() {
    this.http.get(this.url + '/auth/loggedIn')
    .subscribe(
      res => {
        console.log('logged in', res);
      },
      err => {
        console.error(err);
      }
    );
  }

  /**
   * Updates the profile of the current user.
   * @param  {Object}                profile Profile data
   * @return {Observbable<Response>}
   */
  public updateProfile(profile: Object): Observable<Response> {
    return this.authHttp.put(
      this.url + '/api/profile',
      JSON.stringify(profile), {
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      }
    );
  }

  /**
   * Gets the complete profile of the given username or, if null, the
   * currently logged in user.
   * @return {Observable<Response>}
   */
  public getProfile(username: string = null): Observable<Response> {
    return this.authHttp.get(
      this.url + '/api/profile' + (username ? '/' + username : ''), {
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      }
    );
  }
}
