import { UserTextListEntryComponent } from './user-text-list-entry.component';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared';
import { EmojiModule } from '../emoji';
import { ProfileModule } from '../profile';
import { MomentModule } from 'angular2-moment';

@NgModule({
  imports: [
    SharedModule,
    MomentModule,
    ProfileModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    EmojiModule,
  ],
  declarations: [
    UserTextListEntryComponent
  ],
  exports: [
    UserTextListEntryComponent
  ]
})
export class UserTextListModule { }
