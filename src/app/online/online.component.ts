import { Component, Input, Injectable, forwardRef, OnChanges, OnDestroy } from '@angular/core';
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
export class OnlineComponent implements OnChanges, OnDestroy {

  @Input() detailed = true;

  socketSubscription: Subscription;
  onlineCounter = 0;
  onlineUsers: Array<any> = [];

  constructor(public userService: UserService) {
    // initially load online counter
    this.userService.getOnlineCount()
      .subscribe(res => this.onlineCounter = res);

    // intialize socket
    this.socketSubscription = userService.getOnlineSocket().subscribe(res => {
      this.onlineCounter = this.onlineCounter + res >= 0
        ? this.onlineCounter + res
        : this.onlineCounter;

      if (this.onlineCounter > 0 && this.detailed) {
        this.loadOnlineUsers();
      }
    });

    if (this.detailed) {
      this.loadOnlineUsers();
    }
  }

  loadOnlineUsers() {
    this.userService.getOnlineUsers()
      .map(res => res.json())
      .subscribe(res => this.onlineUsers = res);
  }

  ngOnChanges() {
    if (this.detailed) {
      this.loadOnlineUsers();
    }
  }

  ngOnDestroy() {
    this.socketSubscription.unsubscribe();
  }
}
