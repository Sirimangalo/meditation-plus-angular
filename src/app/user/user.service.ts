import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { ApiConfig } from '../../api.config';

@Injectable()
export class UserService {

  url: string = ApiConfig.url;

  public constructor(public http: Http) {

  }

  public login(username: String, password: String) {
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

  public logout() {
    window.localStorage.removeItem('id_token');
    this.http.post(
      this.url + '/auth/logout',
      ''
    ).subscribe(() => {});
  }

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

}
