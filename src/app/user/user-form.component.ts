import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from '../user/user.service';
import { Observable } from 'rxjs/Rx';
import { AppState } from '../app.service';
import { Country } from '../profile/country';
import * as jstz from 'jstimezonedetect';
// tslint:disable-next-line
import * as timezones from 'timezones.json';

@Component({
  selector: 'user-form',
  templateUrl: './user-form.component.html',
  styleUrls: [
    './user-form.component.styl'
  ]
})
export class UserFormComponent {

  @Input() model: any = {};
  @Output() modelChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() admin = false;
  timezones = timezones;

  countryList = Country.list;
  sounds: Object[] = [
    { name: 'Bell 1', src: '/assets/audio/bell.mp3'},
    { name: 'Bell 2', src: '/assets/audio/bell1.mp3'},
    { name: 'Birds', src: '/assets/audio/birds.mp3'},
    { name: 'Bowl', src: '/assets/audio/bowl.mp3'},
    { name: 'Gong', src: '/assets/audio/gong.mp3'},
    { name: 'Notification Sound', src: '/assets/audio/solemn.mp3'}
  ];
  currentSound;

  playSound() {
    if (this.model.sound) {
      this.currentSound = new Audio(this.model.sound);
      this.currentSound.play();
    }
  }

  stopSound() {
    if (this.currentSound) {
      this.currentSound.pause();
      this.currentSound.currentTime = 0;
    }
  }

  detectTimezone() {
    const detectedUtcName = jstz.determine().name();
    const detectedTz = this
      .timezones
      .filter(tz => tz.utc ? tz.utc.indexOf(detectedUtcName) > -1 : false)
      .reduce(tz => tz);

    if (detectedTz) {
      this.model.timezone = detectedTz.value;
      return;
    }

    alert('Your timezone was not detected.');
  }
}
