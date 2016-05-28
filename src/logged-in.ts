import { appInjector } from './app-injector';
import { Router } from '@angular/router-deprecated';
import { JwtHelper } from 'angular2-jwt';

const jwtHelper: JwtHelper = new JwtHelper();

/**
 * Helper function for CanActive
 * Based on http://plnkr.co/edit/siMNH53PCuvUBRLk6suc?p=preview
 */
export const loggedIn = (next, prev): boolean => {
  let injector = appInjector();
  let router = injector.get(Router);

  if (!window.localStorage.getItem('id_token') || jwtHelper.isTokenExpired(window.localStorage.getItem('id_token'))) {
    router.navigate(['/Login']);
    return false;
  }

  return true;
};