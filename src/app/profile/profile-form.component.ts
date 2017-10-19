import { Component, OnInit } from '@angular/core';
import { UserService } from '../user/user.service';
import { AppState } from '../app.service';

@Component({
  selector: 'profile-form',
  templateUrl: './profile-form.component.html'
})
export class ProfileFormComponent implements OnInit {

  profile;
  loading: boolean;
  updated: boolean;
  error: boolean;

  constructor(
    public userService: UserService,
    public appState: AppState
  ) {
    this.appState.set('title', 'Your Profile');
  }

  save() {
    this.updated = false;
    this.error = false;

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
        () => this.updated = true,
        err => {
          this.loading = false;
          this.error = true;
          console.log(err);
        },
        () => this.loading = false
      );
  }

  ngOnInit() {
    this.userService.getProfile()
      .map(res => res.json())
      .subscribe(
        data => this.profile = data,
        err => console.error(err)
      );
  }
}
