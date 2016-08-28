import {
  addProviders,
  inject
} from '@angular/core/testing';

// Load the implementations that should be tested
import { provide } from '@angular/core';
import { Router } from '@angular/router';
import { App } from './app.component';
import { AppState } from './app.service';
import { UserService } from './user/user.service';
import { Http, HTTP_PROVIDERS } from '@angular/http';
import { Title } from '@angular/platform-browser';
import { AuthHttp } from 'angular2-jwt';

describe('App', () => {
  beforeEach(() => {
    addProviders([
      AppState,
      Http,
      Title,
      HTTP_PROVIDERS,
      provide(Router, {
        useValue: {
          // Note that the params and method name must match something that exists in AuthHttp
          navigate: (url: string) => {
            return null;
          }
        }
      }),
      UserService,
      provide(AuthHttp, {
        useValue: {
          // Note that the params and method name must match something that exists in AuthHttp
          get: (url: string) => {
            return null;
          }
        }
      }),
      App
    ]);
  });

  it('should init', inject([ App ], (app) => {
    expect(app.name).toEqual('Meditation+');
  }));

});
