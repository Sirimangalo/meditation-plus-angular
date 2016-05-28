import { Component } from '@angular/core';
import { UserService } from '../user/user.service';
import { CanActivate, Router, RouteParams } from '@angular/router-deprecated';
import { Observable } from 'rxjs/Rx';
import { loggedIn } from '../../logged-in.ts';

@Component({
  selector: 'profile',
  template: require('./profile.html'),
  styles: [
    require('./profile.css')
  ]
})
@CanActivate((next, prev) => {
  return loggedIn(next, prev)
})
export class ProfileComponent {

  profile: Object;
  notFound: boolean = false;

  constructor(
    public userService: UserService,
    public router: Router,
    public params: RouteParams
  ) {
  }

  ngOnInit() {
    this.userService.getProfile(this.params.get('username'))
      .map(res => res.json())
      .subscribe(
        data => { console.log(data); this.profile = data; },
        err => {
          if (err.status === 404) {
            this.notFound = true;
            return;
          }
          console.error(err)
        }
      );
  }
}
