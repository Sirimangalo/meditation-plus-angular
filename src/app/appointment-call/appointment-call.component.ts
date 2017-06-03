import { Component, ApplicationRef, ViewChild, ElementRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';
import { AppointmentService } from '../appointment/appointment.service';
import { UserService } from '../user/user.service';
import * as moment from 'moment';
import * as $script from 'scriptjs';

// HACK: for Google APIs
declare var gapi: any;

@Component({
  selector: 'appointment-call',
  templateUrl: './appointment-call.component.html',
  styleUrls: [
    './appointment-call.component.styl',
  ]
})
export class AppointmentCallComponent {

  appointment: Object;

  loading: boolean = true;
  initiated: boolean;
  ended: boolean;
  error: string;

  constructor(
    public appointmentService: AppointmentService,
    public appRef: ApplicationRef,
    public userService: UserService
  ) {
    this.reset();
  }

  reset(): void {
    this.initiated = false;
    this.ended = false;
    this.error = '';
    this.loading = true;
    this.appointmentService.getNow()
      .subscribe(appointment => {
        this.appointment = appointment;
        this.loading = false;

        if (appointment) {
          this.activateHangoutsButton();
        }
      });


  }

  /**
   * Display Hangouts Button
   */
  activateHangoutsButton(): void {
    // initialize Google Hangouts Button
    $script('https://apis.google.com/js/platform.js', () => {
      // kick in Change Detection
      this.appRef.tick();

      gapi.hangout.render('hangout-button', {
        render: 'createhangout',
        invites: [{ 'id': 'yuttadhammo@gmail.com', 'invite_type': 'EMAIL' }],
        initial_apps: [{
          app_id: '211383333638',
          start_data: 'dQw4w9WgXcQ',
          app_type: 'ROOM_APP'
        }],
        widget_size: 175
      });
    });
  }

  /**
   * Format a number representing an hour to
   * a string in the format 'HH:mmm'.
   *
   * Example: 700 => '07:00', 55 => '00:55'
   *
   * @param  {number} hour Number representing an hour
   * @return {string}      Formatted String
   */
  parseHour(hour: number): string {
    let res = ('0000' + hour.toString()).slice(-4);
    return res.slice(0, 2) + ':' + res.slice(2);
  }

  initiateAppointment() {
    this.initiated = true;
  }

  showError(evt) {
    if (!evt || typeof evt !== 'string') {
      return;
    }

    this.error = evt;
  }

  showEndingScreen() {
    this.ended = true;
  }
}
