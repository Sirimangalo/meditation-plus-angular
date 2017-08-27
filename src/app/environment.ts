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
import { SettingsService } from './shared';
import { AuthGuard } from '../app/auth-guard';
import { LoginGuard } from '../app/login-guard';
import { AdminGuard } from '../app/admin-guard';
import { Title } from '@angular/platform-browser';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { Http, RequestOptions } from '@angular/http';

// AOT hack for angular2-jwt
// Source: https://github.com/auth0/angular2-jwt/issues/158#issuecomment-250461735
export function authFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({
    // Config options if you want
  }), http, options);
}

// Include this in your ngModule providers
export const authProvider = {
  provide: AuthHttp,
  deps: [Http, RequestOptions],
  useFactory: authFactory
};

// Environment Providers
export const ENV_PROVIDERS: any[] = [
  SettingsService,
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
  authProvider,
  { provide: LocationStrategy, useClass: PathLocationStrategy }
];
