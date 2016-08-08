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
  sounds: Object[] = [
    { name: 'Bell 1', src: '/assets/audio/bell.mp3'},
    { name: 'Bell 2', src: '/assets/audio/bell1.mp3'},
    { name: 'Birds', src: '/assets/audio/birds.mp3'},
    { name: 'Bowl', src: '/assets/audio/bowl.mp3'},
    { name: 'Gong', src: '/assets/audio/gong.mp3'}
  ];
  currentSound;

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

  playSound() {
    if (this.profile.sound){
      this.currentSound = new Audio(this.profile.sound);
      this.currentSound.play();
    }
  }
  stopSound() {
    if (this.currentSound){
      this.currentSound.pause();
      this.currentSound.currentTime = 0;
    }
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
