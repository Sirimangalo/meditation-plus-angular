import { UserTextListModule } from './../user-text-list/user-text-list.module';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared';
import { MessageComponent } from './message.component';
import { MessageListEntryComponent } from './list-entry/message-list-entry.component';
import { EmojiModule } from '../emoji';
import { ProfileModule } from '../profile';
import { MomentModule } from 'angular2-moment';
import { MentionsPipe } from './mentions.pipe';

@NgModule({
  imports: [
    SharedModule,
    ProfileModule,
    FormsModule,
    RouterModule,
    EmojiModule,
    MomentModule,
    UserTextListModule
  ],
  declarations: [
    MessageComponent,
    MessageListEntryComponent,
    MentionsPipe
  ],
  exports: [
    MessageComponent,
    MessageListEntryComponent,
    MentionsPipe
  ]
})
export class MessageModule { }
