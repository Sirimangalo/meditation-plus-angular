import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { AuthConfig } from 'angular2-jwt/angular2-jwt';
import { AuthHttp } from './auth-http.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinkyModule } from 'angular-linky';
import { WebsocketService } from './websocket.service';
import { MaterialModule } from './material.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    LinkyModule
  ],
  providers: [
    WebsocketService,
    AuthHttp
  ],
  exports: [
    CommonModule,
    MaterialModule,
    LinkyModule
  ]
})
export class SharedModule { }
