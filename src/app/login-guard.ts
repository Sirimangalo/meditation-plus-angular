import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import { JwtHelper } from 'angular2-jwt';

const jwtHelper: JwtHelper = new JwtHelper();

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (window.localStorage.getItem('id_token') &&
      !jwtHelper.isTokenExpired(window.localStorage.getItem('id_token'))) {

      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}
