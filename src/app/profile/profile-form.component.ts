import { Component } from '@angular/core';
import { UserService } from '../user/user.service';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'profile-form',
  template: require('./profile-form.html'),
  styles: [
    require('./profile-form.css')
  ]
})
export class ProfileFormComponent {

  profile: Object;

  constructor(
    public userService: UserService
  ) {
  }

  save() {
    this.userService.updateProfile(this.profile)
      .subscribe(
        () => {
          // TODO: notify ok
        },
        err => console.log(err)
      );
  }

  ngOnInit() {
    this.userService.getProfile()
      .map(res => res.json())
      .subscribe(
        data => { console.log(data); this.profile = data; },
        err => console.error(err)
      );
  }
}
