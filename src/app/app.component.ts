/*
 * Angular 2 decorators and services
 */
import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { AppState } from './app.service';
import { UserService } from './user/user.service';
import { tokenNotExpired } from 'angular2-jwt';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styles: [
    require('normalize.css'),
    require('./emoji/emojione-awesome.css'),
    require('./app.css')
  ],
  template: require('./app.html')
})
export class App {
  name: string = 'Meditation+';
  title: string = '';

  constructor(
    public appState: AppState,
    public userService: UserService,
    public router: Router
  ) {
    appState
      .stateChange
      .filter(res => res.hasOwnProperty('title'))
      .subscribe(res => this.title = res.title);
  }

  isLoggedIn() {
    return tokenNotExpired();
  }

  get isAdmin(): boolean {
    return this.userService.isAdmin();
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}

/*
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */
