import { Component } from '@angular/core';
import { UserService } from '../user/user.service';
import { Observable } from 'rxjs/Rx';
import { AppState } from '../';
import { Country } from './country';

@Component({
  selector: 'profile-form',
  template: require('./profile-form.html'),
  styles: [
    require('./profile-form.css')
  ]
})
export class ProfileFormComponent {

  profile;
  loading: boolean = false;
  updated: boolean = false;
  countryList = Country.list;

  constructor(
    public userService: UserService,
    public appState: AppState
  ) {
    this.appState.set('title', 'Your Profile');
  }

  save() {
    this.updated = false;

    // check if passwords equal
    if (this.profile.newPassword &&
      this.profile.newPassword !== this.profile.newPasswordRepeat) {
      alert('Passwords do not match.');
      return;
    }

    // remove repeated password from payload
    if (this.profile.newPassword) {
      delete this.profile.newPasswordRepeat;
    }

    this.loading = true;
    this.userService.updateProfile(this.profile)
      .subscribe(
        () => {
          this.updated = true;
        },
        err => console.log(err),
        () => this.loading = false
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
