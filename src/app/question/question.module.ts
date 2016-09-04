import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared';
import { QuestionComponent } from './question.component';
import { QuestionListEntryComponent } from './list-entry/question-list-entry.component';
import { EmojiModule } from '../emoji';
import { ProfileModule } from '../profile';
import { MomentModule } from 'angular2-moment';

@NgModule({
  imports: [
    SharedModule,
    MomentModule,
    ProfileModule,
    FormsModule,
    RouterModule,
    EmojiModule,
  ],
  declarations: [
    QuestionComponent,
    QuestionListEntryComponent
  ],
  exports: [
    QuestionComponent,
    QuestionListEntryComponent
  ]
})
export class QuestionModule { }
