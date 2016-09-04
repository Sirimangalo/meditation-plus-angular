
// Angular 2
import { enableDebugTools, disableDebugTools } from '@angular/platform-browser';
import { enableProdMode, ApplicationRef } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { UserService } from '../app/user/user.service';
import { MessageService } from '../app/message/message.service';
import { QuestionService } from '../app/question/question.service';
import { CommitmentService } from '../app/commitment/commitment.service';
import { MeditationService } from '../app/meditation/meditation.service';
import { LiveService } from '../app/live/live.service';
import { AppointmentService } from '../app/appointment/appointment.service';
import { TestimonialService } from '../app/testimonial';
import { AuthGuard } from '../app/auth-guard';
import { LoginGuard } from '../app/login-guard';
import { AdminGuard } from '../app/admin-guard';
import { AUTH_PROVIDERS } from 'angular2-jwt/angular2-jwt';
import { Title } from '@angular/platform-browser';

// Environment Providers
let PROVIDERS = [
  UserService,
  MessageService,
  QuestionService,
  MeditationService,
  CommitmentService,
  AppointmentService,
  TestimonialService,
  LiveService,
  AuthGuard,
  LoginGuard,
  AdminGuard,
  Title,
  AUTH_PROVIDERS,
  { provide: LocationStrategy, useClass: PathLocationStrategy }
];

let _decorateModuleRef = function identity(value) { return value; };

if ('production' === ENV) {
  // Production
  disableDebugTools();
  enableProdMode();

PROVIDERS = [
    ...PROVIDERS,
    // custom providers in production
  ];

} else {

  _decorateModuleRef = (modRef: any) => {
    let appRef = modRef.injector.get(ApplicationRef);
    let cmpRef = appRef.components[0];
    let _ng = (<any>window).ng;
    enableDebugTools(modRef);
    (<any>window).ng.probe = _ng.probe;
    (<any>window).ng.coreTokens = _ng.coreTokens;
    return modRef;
  };

  // Development
  PROVIDERS = [
    ...PROVIDERS,
    // custom providers in development
  ];

}

export const decorateModuleRef = _decorateModuleRef;

export const ENV_PROVIDERS = [
  ...PROVIDERS
];
