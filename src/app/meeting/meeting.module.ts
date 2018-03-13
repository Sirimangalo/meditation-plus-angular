import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared';
import { ProfileModule } from '../profile';
import { EmojiModule } from '../emoji';
import { MomentModule } from 'angular2-moment';
import { VideoChatComponent } from './videochat/videochat.component';
import { MeetingComponent } from './meeting.component';
import { MessageModule } from '../message';
import { UserTextListModule } from '../user-text-list';
import { AppointmentModule } from '../appointment';
import { TextchatComponent } from './textchat/textchat.component';
import { HistoryComponent } from './history/history.component';

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    RouterModule,
    MomentModule,
    ProfileModule,
    EmojiModule,
    MessageModule,
    AppointmentModule,
    // TODO: use this or message not both
    UserTextListModule
  ],
  declarations: [
    MeetingComponent,
    VideoChatComponent,
    HistoryComponent,
    TextchatComponent
  ],
  exports: [
    MeetingComponent,
    VideoChatComponent,
    HistoryComponent,
    TextchatComponent
  ],
})
export class MeetingModule { }
