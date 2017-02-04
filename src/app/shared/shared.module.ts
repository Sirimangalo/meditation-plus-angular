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
    WebsocketService
  ],
  exports: [
    CommonModule,
    MaterialModule,
    LinkyModule
  ]
})
export class SharedModule { }
