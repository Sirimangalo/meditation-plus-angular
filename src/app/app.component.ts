/*
 * Angular 2 decorators and services
 */
import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { AppState } from './app.service';
import { UserService } from './user/user.service';
import { tokenNotExpired } from 'angular2-jwt/angular2-jwt';
import { OnlineComponent } from './online';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styles: [
    require('normalize.css'),
    require('emojione/assets/css/emojione-awesome.css'),
    require('./app.component.css'),
    require('../../node_modules/@angular2-material/core/style/core.css'),
    require('../../node_modules/@angular2-material/core/overlay/overlay.css')
  ],
  template: require('./app.component.html')
})
export class AppComponent {
  @ViewChild('start') sidenav: any;

  name: string = 'Meditation+';
  title: string = '';
  hideOnlineBadge: boolean = false;

  constructor(
    public appState: AppState,
    public userService: UserService,
    public router: Router,
    public titleService: Title
  ) {
    // listen for title changes
    appState
      .stateChange
      .filter(res => res.hasOwnProperty('title'))
      .subscribe(res => {
        this.title = res.title;
        this.titleService.setTitle(this.title ? this.title : this.name);
      });

    // listen for sidenav changes
    appState
      .stateChange
      .filter(res => res.hasOwnProperty('openSidenav'))
      .subscribe(res => {
        if (res.openSidenav === true) {
          this.sidenavOpen();
        }
      });

    appState.set('openSidenav', false);

    userService.registerRefresh();
  }

  isLoggedIn() {
    return tokenNotExpired();
  }

  get userId(): string {
    return window.localStorage.getItem('id');
  }

  get isAdmin(): boolean {
    return this.userService.isAdmin();
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/login']);
  }

  sidenavOpen() {
    if (this.sidenav._isClosed){
      this.sidenav.open();
    }
    this.appState.set('openSidenav', false);
  }

  sidenavClose() {
    if (this.sidenav._isOpened){
      this.sidenav.close();
    }
  }

  swipeOpen() {
    // skip if gesture conflicts with tab layout
    if (this.router.url === '/' || this.router.url.indexOf('home') > -1) {
      return;
    }
    this.sidenavOpen();
  }
}

/*
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */
