import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinkyPipe } from 'angular2-linky';
import { MaterialModule } from '../../platform/angular2-material2';
import { WebsocketService } from './websocket.service';
import { LongpressButtonDirective } from './longpress-button.directive';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule.forRoot()
  ],
  declarations: [
    LinkyPipe,
    LongpressButtonDirective
  ],
  providers: [
    WebsocketService
  ],
  exports: [
    CommonModule,
    MaterialModule,
    LinkyPipe,
    LongpressButtonDirective
  ]
})
export class SharedModule { }
