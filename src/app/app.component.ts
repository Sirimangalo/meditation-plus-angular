/*
 * Angular 2 decorators and services
 */
import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { AppState } from './app.service';
import { UserService } from './user/user.service';
import { tokenNotExpired } from 'angular2-jwt';
import 'rxjs/add/operator/filter';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app-root',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.component.styl',
  ],
  templateUrl: './app.component.html'
})
export class AppComponent {
  @ViewChild('start') public sidenav: any;

  public name = 'Meditation+';
  public title = '';
  public hideOnlineBadge = false;
  public hideToolbar = false;

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
        if (res.openSidenav && this.sidenav._isClosed) {
          this.sidenav.open();
        }
      });

    // listen for toolbar changes
    appState
      .stateChange
      .filter(res => res.hasOwnProperty('hideToolbar'))
      .subscribe(res => {
        this.hideToolbar = res.hideToolbar === true;
      });

    userService.registerRefresh();
  }

  public isLoggedIn() {
    return tokenNotExpired();
  }

  get userId(): string {
    return window.localStorage.getItem('id');
  }

  get isAdmin(): boolean {
    return this.userService.isAdmin();
  }

  public logout() {
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}
