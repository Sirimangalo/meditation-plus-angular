import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable, Subscription } from 'rxjs/Rx';
import { ApiConfig } from '../../api.config';
import { AuthHttp } from 'angular2-jwt';
import * as moment from 'moment';

@Injectable()
export class UserService {

  public static adminRole: string = 'ROLE_ADMIN';

  url: string = ApiConfig.url;
  refreshedToken;
  refreshSubscription: Subscription;

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

    observable
      .map(res => res.json())
      .subscribe(
      res => {
        this.refreshedToken = moment();

        window.localStorage.setItem('id_token', res.token);
        window.localStorage.setItem('id', res.id);
        window.localStorage.setItem('role', res.role);
        window.localStorage.setItem('username', username);

        // Refresh the token every hour
        this.registerRefresh();
      },
      err => {
        console.error(err);
      }
    );

    return observable;
  }

  /**
   * Register refresh subscription
   */
  public registerRefresh() {
    if (this.refreshSubscription || !window.localStorage.getItem('id_token')) {
      return;
    }

    this.refreshSubscription = Observable
      .interval(1000 * 60 * 60)
      .subscribe(() => { this.checkRefresh(); });
  }

  /**
   * Checks whether the currently logged in user is an admin.
   * @return {boolean} true: admin, false: no admin
   */
  public isAdmin(): boolean {
    return window.localStorage.getItem('role') === UserService.adminRole;
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
    window.localStorage.removeItem('role');

    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }

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

  /**
   * Refreshes the local JWT
   */
  private refresh() {
    this.authHttp.post(
      this.url + '/auth/refresh',
      null, {
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      }
    ).map(res => res.json())
      .subscribe(res => {
        this.refreshedToken = moment();
        window.localStorage.setItem('id_token', res.token);
      },
      err => {
        console.error(err);
      }
    );
  }

  /**
   * Checks if the last refresh is an hour ago.
   */
  private checkRefresh() {
    const duration = moment.duration(moment().diff(this.refreshedToken));

    if (!this.refreshedToken || duration.asMinutes() >= 60) {
      this.refresh();
    }
  }
}
