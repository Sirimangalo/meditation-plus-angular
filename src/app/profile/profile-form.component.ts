import { Component } from '@angular/core';
import { UserService } from '../user/user.service';
import { Observable } from 'rxjs/Rx';
import { AppState } from '../';
import { Router } from '@angular/router';

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

  constructor(
    public userService: UserService,
    public appState: AppState,
    public router: Router
  ) {
    this.appState.set('title', 'Your Profile');
  }

  save() {
    this.loading = true;
    this.userService.updateProfile(this.profile)
      .subscribe(
        () => {
          this.router.navigate(['/profile/', this.profile.local.username]);
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
