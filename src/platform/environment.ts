
// Angular 2
import { enableDebugTools, disableDebugTools } from '@angular/platform-browser';
import { enableProdMode } from '@angular/core';
import { UserService } from '../app/user/user.service';
import { MessageService } from '../app/message/message.service';
import { CommitmentService } from '../app/commitment/commitment.service';
import { MeditationService } from '../app/meditation/meditation.service';
import { AppointmentService } from '../app/appointment/appointment.service';
import { TestimonialService } from '../app/testimonials/testimonials.service';
import { AuthGuard } from '../app/auth-guard';
import { LoginGuard } from '../app/login-guard';
import { AdminGuard } from '../app/admin-guard';
import { AUTH_PROVIDERS } from 'angular2-jwt';

// Environment Providers
let PROVIDERS = [
  UserService,
  MessageService,
  MeditationService,
  CommitmentService,
  AppointmentService,
  TestimonialService,
  AuthGuard,
  LoginGuard,
  AdminGuard,
  AUTH_PROVIDERS
];

let _decorateComponentRef = function identity(value) { return value; };

if ('production' === ENV) {
  // Production
  disableDebugTools();
  enableProdMode();

PROVIDERS = [
    ...PROVIDERS,
    // custom providers in production
  ];

} else {

  _decorateComponentRef = (cmpRef) => {
    let _ng = (<any>window).ng;
    enableDebugTools(cmpRef);
    (<any>window).ng.probe = _ng.probe;
    (<any>window).ng.coreTokens = _ng.coreTokens;
    return cmpRef;
  };

  // Development
  PROVIDERS = [
    ...PROVIDERS,
    // custom providers in development
  ];

}

export const decorateComponentRef = _decorateComponentRef;

export const ENV_PROVIDERS = [
  ...PROVIDERS
];
