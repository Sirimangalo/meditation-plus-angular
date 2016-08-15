import { Component, Input, Injectable, forwardRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';
import { UserService } from '../user';
import { AvatarDirective } from '../profile';

@Injectable()
@Component({
  selector: 'online',
  template: require('./online.component.html'),
  directives: [forwardRef(() => AvatarDirective)],
  styles: [
    require('./online.component.css')
  ]
})
export class OnlineComponent {

  @Input() detailed: boolean = true;
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
      .switchMap(() => this.userService.getOnlineSocket())
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
