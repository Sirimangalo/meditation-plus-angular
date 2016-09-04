import { Component, ViewChild, ElementRef, ApplicationRef } from '@angular/core';
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
  questionSocket;
  currentQuestion: string = '';
  showEmojiSelect: boolean = false;
  loadedInitially: boolean = false;
  sending: boolean = false;
  tabIndex: number = 0;
  showForm: boolean = false;

  constructor(
    public questionService: QuestionService,
    public userService: UserService,
    private appRef: ApplicationRef
  ) {
  }

  selectChange(target) {
    this.tabIndex = target.index;
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
      .subscribe(data => { this.loadQuestions(); });
  }

  ngOnDestroy() {
    this.questionSocket.unsubscribe();
  }
}
