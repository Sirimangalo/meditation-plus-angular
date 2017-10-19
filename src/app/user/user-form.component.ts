import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { UserService } from '../user/user.service';
import { Country } from '../profile/country';
import * as jstz from 'jstimezonedetect';
import * as timezones from 'timezones.json';

@Component({
  selector: 'user-form',
  templateUrl: './user-form.component.html',
  styleUrls: [
    './user-form.component.styl'
  ]
})
export class UserFormComponent implements OnInit {

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

  pushSubscription;
  appointNotify: boolean;

  constructor(private userService: UserService) {}

  ngOnInit() {
    // Ask permission to send PUSH NOTIFICATIONS
    // and send the subscription to the server
    if (navigator && 'serviceWorker' in navigator) {
      navigator['serviceWorker'].ready.then(reg => {
        reg.pushManager.subscribe({ userVisibleOnly: true }).then(subscription => {
          this.userService
            .registerPushSubscription(subscription)
            .map(res => res.json())
            .subscribe(doc => {
              this.pushSubscription = doc;
              this.appointNotify =
                this.model.notifications.appointment.indexOf(doc._id) >= 0;
            });
        });
      });
    }
  }

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

  toggleNotifyAppointments() {
    if (!this.pushSubscription || !this.model || !this.model.notifications) {
      return;
    }

    if (!this.model.notifications.appointment) {
      this.model.notifications.appointment = [];
    }

    const index = this.model.notifications.appointment.indexOf(this.pushSubscription._id);
    if (index >= 0) {
      this.model.notifications.appointment.splice(index, 1);
      this.appointNotify = false;
    } else {
      this.model.notifications.appointment.push(this.pushSubscription._id);
      this.appointNotify = true;
    }
  }
}
