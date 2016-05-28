/*
 * Angular 2 decorators and services
 */
import { Component, ViewEncapsulation } from '@angular/core';
import { RouteConfig, Router } from '@angular/router-deprecated';

import { AppState } from './app.service';
import { Home } from './home';
import { Login } from './login';
import { ProfileComponent, ProfileFormComponent } from './profile';
import { RouterActive } from './router-active';
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
    require('./app.css')
  ],
  template: require('./app.html')
})
@RouteConfig([
  { path: '/', name: 'Index', component: Home },
  { path: '/profile', name: 'ProfileForm', component: ProfileFormComponent },
  { path: '/profile/:username', name: 'ProfileShow', component: ProfileComponent },
  { path: '/login', name: 'Login', component: Login, useAsDefault: true }
])
export class App {
  angularclassLogo = 'assets/img/angularclass-avatar.png';
  loading = false;
  name = 'Meditation+';

  constructor(
    public appState: AppState,
    public userService: UserService,
    public router: Router
  ) {
  }

  isLoggedIn() {
    return tokenNotExpired();
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['Login']);
  }

  ngOnInit() {
    console.log('Initial App State', this.appState.state);
  }

}

/*
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */
