import { inject, TestBed } from '@angular/core/testing';
// Load the implementations that should be tested
import { Router } from '@angular/router';
import { AppComponent, AppModule } from './';
import { AppState } from './app.service';
import { UserService } from './user/user.service';
import { Http } from '@angular/http';
import { Title } from '@angular/platform-browser';
import { AuthHttp } from 'angular2-jwt/angular2-jwt';

describe('App', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [ AppModule ],
    providers: [
      {
        provide: Router,
        useValue: {
          // Note that the params and method name must match something that exists in AuthHttp
          navigate: (url: string) => {
            return null;
          }
        }
      },
      {
        provide: AuthHttp,
        useValue: {
          // Note that the params and method name must match something that exists in AuthHttp
          get: (url: string) => {
            return null;
          }
        }
      },
      AppComponent
    ]
  }));

  it('should init', inject([ AppComponent ], (app) => {
    expect(app.name).toEqual('Meditation+');
  }));

});
