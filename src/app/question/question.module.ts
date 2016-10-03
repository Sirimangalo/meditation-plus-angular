import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared';
import { QuestionComponent } from './question.component';
import { QuestionListEntryComponent } from './list-entry/question-list-entry.component';
import { QuestionSuggestionsComponent } from './suggestions/suggestions.component';
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
    QuestionComponent,
    QuestionListEntryComponent,
    QuestionSuggestionsComponent
  ],
  exports: [
    QuestionComponent,
    QuestionListEntryComponent,
    QuestionSuggestionsComponent
  ]
})
export class QuestionModule { }
