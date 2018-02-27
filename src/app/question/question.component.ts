import {
  Component,
  EventEmitter,
  OnInit,
  OnDestroy,
  Output
} from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { QuestionService } from './question.service';
import { UserService } from '../user/user.service';

@Component({
  selector: 'question',
  templateUrl: './question.component.html',
  styleUrls: [
    './question.component.styl'
  ]
})
export class QuestionComponent implements OnInit, OnDestroy {

  @Output() loadingFinished: EventEmitter<any> = new EventEmitter<any>();

  questions: Object[];
  answeredQuestions: Object[];
  answeredQuestionsPage = 0;
  noMorePages = false;
  loadedAnsweredTab = false;
  loadingAnsweredPage = false;

  questionSocket;
  currentQuestion = '';
  showEmojiSelect = false;
  loadedInitially = false;
  sending = false;
  tabIndex = 0;
  showForm = false;

  // searching for suggestions
  currentSearch = '';
  formQuestion: FormGroup;
  formSearch: FormGroup;
  search: FormControl = new FormControl('');
  question: FormControl = new FormControl('');

  // params for answered tab
  searchParams = {
    sortBy: 'answeredAt',
    sortOrder: 'descending',
    linkOnly: false,
    search: ''
  };

  constructor(
    public questionService: QuestionService,
    public userService: UserService,
    public fb: FormBuilder
  ) {
    this.formQuestion = fb.group({
      'question': this.question
    });
    this.formSearch = fb.group({
      'search': this.search
    });

    this.question.valueChanges
      .debounceTime(400)
      .subscribe(val => this.currentSearch = val);

    this.search.valueChanges
      .debounceTime(400)
      .subscribe(val => this.loadAnsweredQuestions());
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

        // loaded priority content
        this.loadingFinished.emit();
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

  loadAnsweredQuestions(page = 0) {
    this.loadingAnsweredPage = true;
    this.loadedAnsweredTab = true;

    this.questionService.getQuestions(true, page, this.searchParams)
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

    if (!this.currentQuestion) {
      return;
    }

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
