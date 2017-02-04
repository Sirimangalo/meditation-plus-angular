import { Component, Output, EventEmitter } from '@angular/core';
import { MeditationService } from '../../meditation/meditation.service';
import * as moment from 'moment';

/**
 * Component for logging offline meditations
 */
@Component({
  selector: 'offline-meditation',
  templateUrl: './offline-meditation.html',
  styleUrls: [
    './offline-meditation.styl'
  ]
})
export class OfflineMeditationComponent {
  @Output() reload = new EventEmitter();

  walking = '';
  sitting = '';
  date = moment().format('YYYY-MM-DD').toString();
  time = '';
  success = false;
  error = '';
  sending = false;

  constructor(public meditationService: MeditationService) {}

  clearFormData() {
    this.walking = '';
    this.sitting = '';
    this.date = '';
    this.time = '';
    this.error = '';
    setTimeout( () => {
      this.success = false;
    }, 3000);
  }
  checkDateTime() {
    const reDate = /^20[0-9]{2}-(0[0-9]|1[0-2])-([0-2][0-9]|3[0-1])$/g;
    const reTime = /^([0-1][0-9]|2[0-4]):[0-5][0-9]$/g;
    return this.date.match(reDate) && this.time.match(reTime);
  }

  sendMeditation(evt) {
    evt.preventDefault();

    const walking = this.walking ? parseInt(this.walking, 10) : 0;
    const sitting = this.sitting ? parseInt(this.sitting, 10) : 0;
    const datetime = moment(this.date + ' ' + this.time, 'YYYY-MM-DD HH:mm').utc().toDate();

    if ((!walking && !sitting) || isNaN(datetime.getTime())) {
      return;
    }

    this.sending = true;
    this.meditationService.post(walking, sitting, datetime)
      .map(res => res.json())
      .subscribe(res => {
        this.success = true;
        this.sending = false;
        this.reload.emit('event');
        this.clearFormData();
      }, (err) => {
        this.error = err.json().errMsg;
        this.sending = false;
      });
  }
}
