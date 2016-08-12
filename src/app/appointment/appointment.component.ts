import { Component, ApplicationRef } from '@angular/core';
import { AppointmentService } from './appointment.service';
import { Response } from '@angular/http';
import { Observable, Subscription } from 'rxjs/Rx';
import { CHART_DIRECTIVES } from 'ng2-charts/ng2-charts';
import { AppState } from '../';
import { UserService } from '../user/user.service';

import * as moment from 'moment';

// HACK: for Google APIs
const $script = require('scriptjs');
declare var gapi: any;

@Component({
  selector: 'appointment',
  template: require('./appointment.html'),
  styles: [
    require('./appointment.css')
  ]
})
export class AppointmentComponent {

  appointments: Object[] = [];
  appointmentSocket;
  rightBeforeAppointment: boolean = false;
  loadedInitially: boolean = false;
  userHasAppointment: boolean = false;

  constructor(
    public appointmentService: AppointmentService,
    public appRef: ApplicationRef,
    public appState: AppState,
    public userService: UserService
  ) {
    this.appState.set('title', 'Schedule');
  }

  /**
   * Returns the user id stored in localStorage
   */
  getUserId(): string {
    return window.localStorage.getItem('id');
  }

  /**
   * Returns wether user is admin or not
   */
  get isAdmin(): boolean {
    return this.userService.isAdmin();
  }

  /**
   * Method for querying appointments
   */
  loadAppointments(): void {
    this.userHasAppointment = false;
    this.appointmentService
      .getAll()
      .map(res => res.json())
      .map(res => {
        this.rightBeforeAppointment = false;
        this.loadedInitially = true;

        // find current user and check if appointment is now
        for (const appointment of res.appointments) {
          if (!appointment.user) continue;
          if (appointment.user._id !== this.getUserId()) continue;

          this.userHasAppointment = true;
          const format: string = appointment.hour < 1000 ? 'Hmm' : 'HHmm';

          // show Hangouts Button 5 minutes before and after appointment time
          const hourStart = moment.utc('' + appointment.hour, format)
            .subtract(5, 'minutes');
          const hourEnd = moment.utc('' + appointment.hour, format)
            .add(5, 'minutes');

          if (moment.utc() >= hourStart && moment.utc() <= hourEnd) {
            this.activateHangoutsButton();
            break;
          }
        }

        return res;
      })
      .subscribe(res => this.appointments = res);
  }

  /**
   * Display Hangouts Button
   */
  activateHangoutsButton() {
    // initialize Google Hangouts Button
    $script('https://apis.google.com/js/platform.js', () => {
      this.rightBeforeAppointment = true;

      // kick in Change Detection
      this.appRef.tick();

      gapi.hangout.render('hangout-button', {
        'render': 'createhangout',
        'invites': [{ 'id': 'yuttadhammo@gmail.com', 'invite_type': 'EMAIL' }],
        'initial_apps': [{
          'app_id': '211383333638',
          'start_data': 'dQw4w9WgXcQ',
          'app_type': 'ROOM_APP'
        }],
        'widget_size': 175
      });
    });
  }

  /**
   * Registration handling
   */
  toggleRegistration(evt, appointment) {
    evt.preventDefault();

    // disallow registration for taken time slots
    if (appointment.user && appointment.user._id !== this.getUserId())
      return;

    this.appointmentService.registration(appointment)
      .subscribe(() => {
        this.loadAppointments();
      }, (err) => {
        console.error(err);
      });
  }

  /**
   * Admin can remove registered appointments
   */
  removeRegistration(evt, appointment){
    evt.preventDefault();

    if (!this.isAdmin)
      return;

    this.appointmentService.deleteRegistration(appointment)
      .subscribe(() => {
        this.loadAppointments();
      }, (err) => {
        console.error(err);
      });

  }


  /**
   * Converts UTC hour to local hour.
   * @param  {number} hour UTC hour
   * @return {string}      Local hour
   */
  getLocalHour(hour: number): string {
    return moment(
      moment.utc('' + hour, hour < 1000 ? 'Hmm' : 'HHmm').toDate()
    ).format('HH:mm');
  }

  ngOnInit() {
    this.loadAppointments();

    // initialize websocket for instant data
    this.appointmentSocket = this.appointmentService.getSocket()
      .subscribe(() => {
        this.loadAppointments();
      });
  }

  ngOnDestroy() {
    this.appointmentSocket.unsubscribe();
  }
}
