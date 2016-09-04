import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared';
import { MessageComponent } from './message.component';
import { MessageListEntryComponent } from './list-entry/message-list-entry.component';
import { EmojiModule } from '../emoji';
import { ProfileModule } from '../profile';

@NgModule({
  imports: [
    SharedModule,
    ProfileModule,
    FormsModule,
    RouterModule,
    EmojiModule
  ],
  declarations: [
    MessageComponent,
    MessageListEntryComponent
  ],
  exports: [
    MessageComponent,
    MessageListEntryComponent
  ]
})
export class MessageModule { }
