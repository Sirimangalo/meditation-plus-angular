import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { AuthConfig } from 'angular2-jwt/angular2-jwt';
import { AuthHttp } from './auth-http.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinkyModule } from 'angular2-linky';
import { WebsocketService } from './websocket.service';
import { MaterialModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    LinkyModule
  ],
  providers: [
    WebsocketService,
    {
      provide: AuthHttp,
      useFactory: function useFactory(http, router) {
        return new AuthHttp(new AuthConfig(), http, router);
      },
      deps: [Http, Router]
    }
  ],
  exports: [
    CommonModule,
    MaterialModule,
    LinkyModule
  ]
})
export class SharedModule { }
