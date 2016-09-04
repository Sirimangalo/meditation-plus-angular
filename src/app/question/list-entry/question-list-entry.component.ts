import {
  Component,
  Output,
  Input,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { QuestionService } from '../question.service';

@Component({
  selector: 'question-list-entry',
  template: require('./question-list-entry.component.html'),
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    require('./question-list-entry.component.css')
  ]
})
export class QuestionListEntryComponent {

  @Input() question: any;
  @Input() isAdmin: boolean = false;
  // 0 = unanswered, 1 = answered
  @Input() mode: number = 0;

  loading: boolean = false;

  constructor(public questionService: QuestionService) {}

  get userId() {
    return window.localStorage.getItem('id');
  }

  isHidden() {
    return (!this.question.answered && this.mode === 1) ||
      (this.question.answered && this.mode === 0);
  }

  like() {
    this.loading = true;
    this.questionService.like(this.question)
      .subscribe(
        () => this.loading = false,
        () => this.loading = false
      );
  }

  answer() {
    this.loading = true;
    this.questionService.answer(this.question)
      .subscribe(
        () => this.loading = false,
        () => this.loading = false
    );
  }

  delete() {
    if (!confirm('Are you sure?')) {
      return;
    }

    this.loading = true;
    this.questionService.delete(this.question)
      .subscribe(
        () => this.loading = false,
        () => this.loading = false
    );
  }
}
