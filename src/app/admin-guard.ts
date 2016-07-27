import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { UserService } from './user/user.service';

import { JwtHelper } from 'angular2-jwt';

const jwtHelper: JwtHelper = new JwtHelper();

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private router: Router, private userService: UserService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (window.localStorage.getItem('id_token') &&
      !jwtHelper.isTokenExpired(window.localStorage.getItem('id_token')) &&
      this.userService.isAdmin()) {
      return true;
    }

    this.router.navigate(['login']);
    return false;
  }
}
