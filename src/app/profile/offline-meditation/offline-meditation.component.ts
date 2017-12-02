import { Component, Output, EventEmitter, ViewChild } from '@angular/core';
import { MeditationService } from '../../meditation/meditation.service';
import * as moment from 'moment';
import { NgForm } from '@angular/forms';

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
  @ViewChild('form') public medFor: NgForm;

  today: Date = new Date();
  minDate: Date;

  walking = '';
  sitting = '';
  date: Date = new Date();
  time = moment().subtract(1, 'hour').format('HH:mm');


  success = false;
  error = '';
  sending = false;

  constructor(public meditationService: MeditationService) {
    // set minimum date for logging an offline session
    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate() - 31);
  }

  clearFormData() {
    this.medFor.resetForm();
    this.walking = '';
    this.sitting = '';
    this.date = new Date();
    this.time = '';
    this.error = '';
    setTimeout( () => {
      this.success = false;
    }, 3000);
  }

  checkTime() {
    return new RegExp('^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$').test(this.time);
  }

  sendMeditation(evt) {
    if (evt) {
      evt.preventDefault();
    }

    const walking = this.walking ? parseInt(this.walking, 10) : 0;
    const sitting = this.sitting ? parseInt(this.sitting, 10) : 0;

    if ((!walking && !sitting)) {
      return;
    }

    // specify exact time
    const timeSplit = this.time.split(':');
    this.date.setHours(parseInt(timeSplit[0], 10));
    this.date.setMinutes(parseInt(timeSplit[1], 10));

    // send data to server
    this.sending = true;
    this.meditationService.post(walking, sitting, this.date)
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
