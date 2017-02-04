import {
  Component,
  Output,
  Input,
  EventEmitter,
  ChangeDetectionStrategy,
  OnChanges
} from '@angular/core';
import { QuestionService } from '../question.service';
import * as moment from 'moment';

@Component({
  selector: 'question-list-entry',
  templateUrl: './question-list-entry.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: [
    './question-list-entry.component.styl'
  ]
})
export class QuestionListEntryComponent implements OnChanges {

  @Input() question: any;
  @Input() isAdmin = false;
  // 0 = unanswered, 1 = answered, 2 = suggestion
  @Input() mode = 0;
  @Output() answered: EventEmitter<Object> = new EventEmitter<Object>();
  @Output() answeringStarted: EventEmitter<Object> = new EventEmitter<Object>();
  @Output() answeringStopped: EventEmitter<Object> = new EventEmitter<Object>();

  loading = false;

  constructor(public questionService: QuestionService) {}

  get userId() {
    return window.localStorage.getItem('id');
  }

  ngOnChanges() {
    if (!this.question.broadcast) {
      return this.question;
    }

    // generate broadcast diff
    const broadcastStarted = moment(this.question.broadcast.started);
    const answering = moment(this.question.answeringAt);
    const duration = moment.duration(answering.diff(broadcastStarted));
    this.question.broadcastDiff = Math.round(duration.asSeconds());
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
        () => {
          this.loading = false;
          this.answered.emit(this.question);
        },
        () => this.loading = false
    );
  }

  answering() {
    this.loading = true;
    this.questionService.answering(this.question)
      .subscribe(
        () => {
          this.loading = false;
          this.answeringStarted.emit(this.question);
        },
        () => this.loading = false
    );
  }

  unanswering() {
    this.loading = true;
    this.questionService.unanswering(this.question)
      .subscribe(
        () => {
          this.loading = false;
          this.answeringStopped.emit(this.question);
        },
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
