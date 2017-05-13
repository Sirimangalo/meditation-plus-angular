import { Component, ViewChild, OnInit } from '@angular/core';
import { MeditationComponent } from '../meditation';
import { Router, ActivatedRoute } from '@angular/router';
import { AppState } from '../app.service';
import { UserService } from '../user/user.service';
import { MessageService } from '../message/message.service';
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

  currentTab = 'meditation';
  activated: string[] = ['meditation'];
  ownSession = false;
  newMessages: number;

  constructor(
    public appState: AppState,
    public route: ActivatedRoute,
    public router: Router,
    private userService: UserService,
    private messageService: MessageService,
    public wsService: WebsocketService
  ) {
    this.appState.set('title', '');
    this.appState.set('openSidenav', false);
    this.route.params
      .filter(res => res.hasOwnProperty('tab'))
      .subscribe(res => this.tab((<any>res).tab));

    // listen for meditation status
    appState
      .stateChange
      .filter(res => res.hasOwnProperty('isMeditating'))
      .subscribe(res => {
        this.ownSession = res.isMeditating || false;
      });

    // Ask permission to send PUSH NOTIFICATIONS
    // and send the subscription to the server
    if (navigator && 'serviceWorker' in navigator) {
      navigator['serviceWorker'].ready.then(reg => {
        reg.pushManager.subscribe({userVisibleOnly: true}).then(subscription => {
          this.userService
            .registerPushSubscription(subscription)
            .subscribe();
        });
      });
    }
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

  ngOnInit() {
    const lastMessageDate = this.messageService.getLastMessage();

    if (lastMessageDate) {
      // Get number of missed messages
      this.wsService.onConnected()
        .switchMap(latestMessage =>
          this.messageService.synchronize(new Date(lastMessageDate), latestMessage.createdAt)
        )
        .map(res => res.json())
        .subscribe(res => this.newMessages = res.length);
    }

    this.wsService.onMessage()
      .filter(() => this.currentTab !== 'chat')
      .subscribe(message => {
        this.newMessages++;

        // Update last message date
        this.messageService.setLastMessage(message['current']['createdAt'].toString());
      });
  }
}
