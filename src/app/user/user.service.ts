import { Subscription } from 'rxjs/Subscription';
import { Injectable } from '@angular/core';
import { ApiConfig } from '../../api.config';
import { AuthHttp } from '../shared/auth-http.service';
import * as moment from 'moment';
import { WebsocketService } from '../shared';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/share';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Headers, Response } from '@angular/http';

interface LoginResponse {
  token: string;
  id: string;
  role: string;
}

@Injectable()
export class UserService {

  public static adminRole = 'ROLE_ADMIN';

  url: string = ApiConfig.url;
  refreshedToken;
  refreshSubscription: Subscription;

  public constructor(
    public http: HttpClient,
    public authHttp: AuthHttp,
    public wsService: WebsocketService
  ) {
  }

  /**
   * Logging in a User via email and password.
   * @param {String} email
   * @param {String} password
   * @param {String} username
   */
  public login(email: string, password: string, username?: string): Observable<LoginResponse> {
    const observable = this.http.post<LoginResponse>(
      this.url + '/auth/login',
      JSON.stringify({email, password, username}), {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
      }
    )
    .share();

    observable
      .subscribe(
      res => {
        this.refreshedToken = moment();

        window.localStorage.setItem('token', res.token);
        window.localStorage.setItem('id', res.id);
        window.localStorage.setItem('role', res.role);

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
   * Verify account by sending token received via email to server
   *
   * @param  {string}               token secret token
   */
  public verify(token: string): Observable<any> {
    return this.http.post<any>(
      ApiConfig.url + '/auth/verify',
      JSON.stringify({
        token: token
      }), {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
      }
    );
  }

  /**
   * Resend email activation with token
   *
   * @param  {string}               email mail address of user
   */
  public resend(email: string): Observable<any> {
    return this.http.post<any>(
      ApiConfig.url + '/auth/resend',
      JSON.stringify({
        email: email
      }), {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
      }
    );
  }

  public resetPasswordInit(email: string): Observable<any> {
    return this.http.post<any>(
      ApiConfig.url + '/auth/reset-init',
      JSON.stringify({ email: email }), {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
      }
    )
  }

  public resetPassword(userId: string, token: string, password: string): Observable<any> {
    return this.http.post<any>(
      ApiConfig.url + '/auth/reset',
      JSON.stringify({
        userId: userId,
        token: token,
        newPassword: password
      }), {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
      }
    );
  }

  /**
   * Register refresh subscription
   */
  public registerRefresh() {
    if (this.refreshSubscription || !window.localStorage.getItem('token')) {
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

  /**
   * Get currently logged in user.
   * @return {string} userId
   */
  public getUserId(): string {
    return window.localStorage.getItem('id');
  }

  public signup(name: string, password: string, email: string, username: string): Observable<any> {
    return this.http.post(
      this.url + '/auth/signup',
      JSON.stringify({name, password, email, username}), {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
      }
    );
  }

  /**
   * Logging out the current user. Removes the token from
   * localStorage.
   */
  public logout(): void {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('id');
    window.localStorage.removeItem('role');

    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }

    this.http.post(
      this.url + '/auth/logout',
      ''
    ).subscribe(null, () => this.wsService.disconnect());
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
   * Gets the complete profile of the given id or, if null, the
   * currently logged in user.
   * @return {Observable<Response>}
   */
  public getProfile(id: string = null): Observable<Response> {
    return this.authHttp.get(
      this.url + '/api/profile' + (id ? '/' + id : ''), {
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      }
    );
  }

  /**
   * Gets the complete profile of the given username.
   * @return {Observable<Response>}
   */
  public getProfileByUsername(username: string): Observable<Response> {
    return this.authHttp.get(
      this.url + '/api/profile/username/' + username, {
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      }
    );
  }

  public getAll() {
    return this.authHttp.get(
      ApiConfig.url + '/api/user'
    );
  }

  public search(term: string) {
    return this.authHttp.post(
      ApiConfig.url + '/api/user/search',
      JSON.stringify({ term }), {
        headers: new Headers({
            'Content-Type': 'application/json'
        })
      }
    );
  }

  public getOnlineCount() {
    const websocket = this.wsService.getSocket();

    websocket.emit('onlinecounter:get');
    return Observable.create(obs => {
      websocket.on('onlinecounter:get', res => obs.next(res));
    });
  }

  public getOnlineUsers() {
    return this.authHttp.get(
      ApiConfig.url + '/api/user/online', {
        headers: new Headers({
            'Content-Type': 'application/json'
        })
      }
    );
  }

  public getOnlineSocket(): Observable<any> {
    const websocket = this.wsService.getSocket();

    return Observable.create(obs => {
      websocket.on('onlinecounter:changed', res => obs.next(res));
    });
  }

  public get(id: string) {
    return this.authHttp.get(
      ApiConfig.url + '/api/user/' + id
    );
  }

  public save(user) {
    const method = user._id ? 'put' : 'post';

    return this.authHttp[method](
      ApiConfig.url + '/api/user' + (user._id ? '/' + user._id : ''),
      user, {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
  }

  public delete(user) {
    return this.authHttp.delete(
      ApiConfig.url + '/api/user/' + user._id, {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
  }

  public registerPushSubscription(subscription) {
    return this.authHttp.post(
      ApiConfig.url + '/api/push/register',
      JSON.stringify(subscription), {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
  }

  public getUsername(search: string) {
    return this.authHttp.get(
      ApiConfig.url + '/api/user/mention/' + search
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
        window.localStorage.setItem('token', res.token);
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
