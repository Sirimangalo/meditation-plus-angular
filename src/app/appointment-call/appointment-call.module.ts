import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared';
import { ProfileModule } from '../profile';
import { EmojiModule } from '../emoji';
import { MomentModule } from 'angular2-moment';
import { VideoChatComponent } from './videochat/videochat.component';
import { AppointmentCallComponent } from './appointment-call.component';

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    RouterModule,
    MomentModule,
    ProfileModule,
    EmojiModule
  ],
  declarations: [
    AppointmentCallComponent,
    VideoChatComponent
  ],
  exports: [
    AppointmentCallComponent,
    VideoChatComponent
  ]
})
export class AppointmentCallModule { }
