import { Component } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';
import { UserService } from '../user';

@Component({
  selector: 'online',
  template: require('./online.component.html'),
  styles: [
    require('./online.component.css')
  ]
})
export class OnlineComponent {

  onlineSubscription: Subscription;
  onlineUsers: Array<any> = [];

  constructor(public userService: UserService) {
    // initially load online users
    this.loadOnlineUsers();

    this.onlineSubscription = userService.getOnlineSocket().subscribe(() => {
      this.loadOnlineUsers();
    });
  }

  loadOnlineUsers() {
    this.userService.getOnline()
      .map(res => res.json())
      .subscribe(res => this.onlineUsers = res);
  }

  ngOnDestroy() {
    this.onlineSubscription.unsubscribe();
  }
}
