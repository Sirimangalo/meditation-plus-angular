import { Component, ViewChild, ElementRef, ApplicationRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { QuestionService } from './question.service';
import { Observable } from 'rxjs/Rx';
import { Response } from '@angular/http';
import { UserService } from '../user/user.service';

@Component({
  selector: 'question',
  template: require('./question.component.html'),
  styles: [
    require('./question.component.css')
  ]
})
export class QuestionComponent {

  questions: Object[];
  answeredQuestions: Object[];
  answeredQuestionsPage: number = 0;
  noMorePages: boolean = false;
  loadedAnsweredTab: boolean = false;
  loadingAnsweredPage: boolean = false;

  questionSocket;
  currentQuestion: string = '';
  showEmojiSelect: boolean = false;
  loadedInitially: boolean = false;
  sending: boolean = false;
  tabIndex: number = 0;
  showForm: boolean = false;

  // searching for suggestions
  currentSearch: string = '';
  form: FormGroup;
  search: FormControl = new FormControl('');

  constructor(
    public questionService: QuestionService,
    public userService: UserService,
    private appRef: ApplicationRef,
    public fb: FormBuilder
  ) {
    this.form = fb.group({
      'search': this.search
    });
    this.search.valueChanges
      .debounceTime(400)
      .subscribe(val => {
        this.currentSearch = val;
      });
  }

  selectChange(target) {
    this.tabIndex = target.index;

    if (this.tabIndex === 1 && !this.loadedAnsweredTab) {
      this.loadAnsweredQuestions();
    }
  }

  get isAdmin(): boolean {
    return this.userService.isAdmin();
  }

  emojiSelect(evt) {
    this.currentQuestion += ':' + evt + ':';
    this.showEmojiSelect = false;
  }

  /**
   * Load all questions at once
   */
  loadQuestions() {
    this.questionService.getQuestions()
      .map(res => res.json())
      .subscribe(data => {
        this.questions = data;
        this.loadedInitially = true;
      });
  }

  answered(question: any) {
    // Add to answered tab, because latest data already has been fetched
    if (this.loadedAnsweredTab) {
      question.answered = true;
      question.answeredAt = new Date();
      this.answeredQuestions.unshift(question);
    }
  }

  loadAnsweredQuestions(page: number = 0) {
    this.loadingAnsweredPage = true;
    this.loadedAnsweredTab = true;

    this.questionService.getQuestions(true, page)
      .map(res => res.json())
      .subscribe(data => {
        this.loadingAnsweredPage = false;

        // stop pagination if no more data
        if (page > 0 && data.length === 0) {
          this.noMorePages = true;
          return;
        }

        this.answeredQuestionsPage = page;

        // initialize on first page, add on another
        if (page === 0) {
          this.answeredQuestions = data;
        } else {
          this.answeredQuestions = this.answeredQuestions.concat(data);
        }
      }, () => this.loadingAnsweredPage = false);
  }

  sendQuestion(evt) {
    evt.preventDefault();

    if (!this.currentQuestion)
      return;

    this.sending = true;
    this.questionService.post(this.currentQuestion)
      .subscribe(() => {
        this.sending = false;
        this.currentQuestion = '';
        this.showForm = false;
      }, (err) => {
        this.sending = false;
        console.error(err);
      });
  }

  ngOnInit() {
    // getting chat data instantly
    this.loadQuestions();

    // subscribe to the websocket
    this.questionSocket = this.questionService.getSocket()
      .subscribe(data => {
        this.loadQuestions();
        if (this.loadedAnsweredTab) {
          this.loadAnsweredQuestions(this.answeredQuestionsPage);
        }
      });
  }

  ngOnDestroy() {
    this.questionSocket.unsubscribe();
  }
}
