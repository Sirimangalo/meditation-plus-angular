import { Component, Input, Injectable, forwardRef, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';
import { UserService } from '../user';

@Injectable()
@Component({
  selector: 'online',
  templateUrl: './online.component.html',
  styleUrls: [
    './online.component.styl'
  ]
})
export class OnlineComponent implements OnDestroy {

  @Input() detailed = true;
  socketSubscription: Subscription;
  pollingSubscription: Subscription;
  onlineUsers: Array<any> = [];

  constructor( public userService: UserService) {
    // initially load online users
    this.loadOnlineUsers();

    // intialize socket
    this.socketSubscription = userService.getOnlineSocket().subscribe(() => {
      this.loadOnlineUsers();
    });

    // initialize polling
    this.pollingSubscription = Observable.interval(120000)
      .switchMap(() => this.userService.getOnline())
      .map(res => (<any>res).json())
      .subscribe(res => this.onlineUsers = res);
  }

  loadOnlineUsers() {
    this.userService.getOnline()
      .map(res => res.json())
      .subscribe(res => this.onlineUsers = res);
  }

  ngOnDestroy() {
    this.socketSubscription.unsubscribe();
    this.pollingSubscription.unsubscribe();
  }
}
