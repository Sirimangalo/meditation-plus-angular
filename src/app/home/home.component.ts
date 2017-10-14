import { Component, ViewChild, OnInit } from '@angular/core';
import { MeditationComponent } from '../meditation';
import { Router, ActivatedRoute } from '@angular/router';
import { AppState } from '../app.service';
import { UserService } from '../user/user.service';
import { MessageService } from '../message/message.service';
import { QuestionService } from '../question/question.service';
import { WebsocketService } from '../shared';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: [
    './home.component.styl'
  ]
})
export class HomeComponent implements OnInit {
  @ViewChild(MeditationComponent) medComponent: MeditationComponent;

  currentTab = '';
  activated: string[] = [];
  isMeditating = false;
  newMessages = 0;
  newQuestions = 0;

  constructor(
    public appState: AppState,
    public route: ActivatedRoute,
    public router: Router,
    private userService: UserService,
    private messageService: MessageService,
    private questionService: QuestionService,
    public wsService: WebsocketService
  ) {
    this.appState.set('title', '');
    this.appState.set('openSidenav', false);

    // set initial tab
    this.tab(this.route.snapshot.params['tab'] || 'meditation');

    // listen for tab change
    this.route.params
      .filter(res => res.hasOwnProperty('tab'))
      .subscribe(res => this.tab((<any>res).tab));

    // listen for meditation status
    appState
      .stateChange
      .filter(res => res.hasOwnProperty('isMeditating'))
      .subscribe(res => this.isMeditating = res.isMeditating === true);
  }

  navigate(tab: string) {
    this.router.navigate(['home', {tab}]);
  }

  getButtonColor(tab: string) {
    return this.currentTab === tab ? 'primary' : '';
  }

  isCurrentTab(tab: string): boolean {
    return this.currentTab === tab;
  }

  tab(tab: string) {
    this.currentTab = tab;

    if (tab === 'meditation' && typeof this.medComponent !== 'undefined') {
      this.medComponent.onActivated();
    }

    if (tab === 'chat') {
      this.newMessages = 0;
    }

    if (this.activated.indexOf(tab) < 0) {
      this.activated.push(tab);
    }
  }

  openSidenav() {
    this.appState.set('openSidenav', true);
  }

  /**
   * Loads content with lower priority
   */
  afterLoadedComponent() {
    const lastMessageDate = this.messageService.getLastMessage();
    if (lastMessageDate) {
      // Get number of new messages
      this.messageService.synchronize(new Date(lastMessageDate), undefined, true)
        .map(res => res.json())
        .subscribe(res => this.newMessages = res);
    }

    // Update message counter on new message
    this.wsService.onMessage()
      .filter(() => this.currentTab !== 'chat')
      .subscribe(() => this.newMessages++);

    // Get number of new questions
    this.questionService.getCount()
      .map(res => res.json())
      .subscribe(count => this.newQuestions = count);

    // Update question counter on new question
    this.questionService.getSocket()
      .subscribe(res => !(res < 0 && this.newQuestions < 1) ? this.newQuestions += res : null);
  }

  ngOnInit() {
    // Ask permission to send PUSH NOTIFICATIONS
    // and send the subscription to the server
    if (navigator && 'serviceWorker' in navigator) {
      navigator['serviceWorker'].ready.then(reg => {
        reg.pushManager.subscribe({ userVisibleOnly: true }).then(subscription => {
          this.userService
            .registerPushSubscription(subscription)
            .subscribe();
        });
      });
    }
  }
}
