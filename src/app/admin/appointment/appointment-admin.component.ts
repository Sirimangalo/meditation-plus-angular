import { Component } from '@angular/core';
import { AppointmentService } from '../../appointment';
import { SettingsService } from '../../shared';
import * as moment from 'moment-timezone';
import 'rxjs/add/operator/map';

@Component({
  selector: 'appointment-admin',
  templateUrl: './appointment-admin.component.html',
  styleUrls: [
    './appointment-admin.component.styl'
  ]
})
export class AppointmentAdminComponent {
  keys = Object.keys;

  initialLoading = true;
  confirmDeletions = true;

  // appointment data + feedback flags
  appointmentData: any = {};
  weekdays: string[] = moment.weekdays();

  timezone: string;
  timezones = moment.tz.names();
  // define standard timezone until 'timezone' is loaded
  zoneName = moment.tz('America/Toronto').zoneName();

  // notification stati
  tickerSubscribed: Boolean;
  tickerLoading: Boolean;
  settings;

  constructor(
    public appointmentService: AppointmentService,
    private settingsService: SettingsService
  ) {
    this.loadAppointments();
    this.loadSettings();
  }

  /**
   * Loads all appointments
   */
  loadAppointments() {
    this.appointmentService
      .getAggregated()
      .map(res => res.json())
      .subscribe(res => {
        this.initialLoading = false;

        const oldHours = Object.keys(this.appointmentData);

        // Update 'appointmentData'
        for (const hour of res) {
          const temp = oldHours.indexOf(hour._id.toString());

          if (temp === -1) {
            this.appointmentData[hour._id] = {
              loading: false,
              error: false,
              errorMsg: '',
              success: false,
              edit: false,
              editLoading: false
            };
          } else {
            oldHours.splice(temp, 1);
          }

          this.appointmentData[hour._id].days = hour.days;
        }

        // remove remaining 'zombies'
        oldHours.map(h => delete this.appointmentData[h]);
      });
  }

  /**
   * Loads the settings entity
   */
  loadSettings() {
    this.settingsService
      .get()
      .map(res => res.json())
      .subscribe(res => {
        this.settings = res;
        this.timezone = res.appointmentsTimezone;
        this.zoneName = moment.tz(this.timezone).zoneName();
      });
  }

  /**
   * Show the edit form for one specific card.
   *
   * @param      {any}  hour    The hour to identify the card
   */
  toggleEdit(hour: any): void {
    if (!(hour in this.appointmentData)) {
      return;
    }
    this.appointmentData[hour].edit = !this.appointmentData[hour].edit;
  }

  /**
   * Toggle the existence of an appointment (via checkbox in the interface).
   *
   * @param      {any}     hour    Hour of appointment
   * @param      {number}  day     Weekday of appointment
   */
  toggleDay(evt: Event, hour: any, day: number): any {
    if (!(hour in this.appointmentData)) {
      return;
    }

    if (this.confirmDeletions && this.appointmentData[hour].days.includes(day) && !confirm('Are you sure?')) {
      evt.preventDefault();
      return;
    }

    // reset user feedback
    this.appointmentData[hour].loading = true;
    this.appointmentData[hour].error = false;
    this.appointmentData[hour].success = false;

    this.appointmentService
      .toggle(parseInt(hour, 10), day)
      .subscribe(
        () => {
          this.loadAppointments();

          // show success indication
          this.appointmentData[hour].loading = false;
          this.appointmentData[hour].error = false;
          this.appointmentData[hour].success = true;
        },
        err => {
          this.loadAppointments();

          // show error indication
          this.appointmentData[hour].errorMsg = err.text();
          this.appointmentData[hour].loading = false;
          this.appointmentData[hour].error = true;
          this.appointmentData[hour].success = false;
        }
      );
  }

  /**
   * Update appointments hours.
   *
   * @param      {any}  evt      An event
   * @param      {any}  oldHour  Hour to identify appointments
   * @param      {any}  newHour  New hour after update
   */
  updateHour(evt: Event, oldHour: any, newHour: any): void {
    if (evt) {
      evt.preventDefault();
    }

    oldHour = parseInt(oldHour, 10);
    newHour = parseInt(newHour, 10);

    if (isNaN(oldHour) || isNaN(newHour) || !(oldHour in this.appointmentData)) {
      return;
    }

    this.appointmentData[oldHour].editLoading = true;
    this.appointmentService
      .update(oldHour, newHour)
      .subscribe(
        () => this.loadAppointments(),
        err => {
          this.appointmentData[oldHour].errorMsg = err.text();
          this.appointmentData[oldHour].error = true;
          this.appointmentData[oldHour].editLoading = false;
        }
      );
  }

  /**
   * Updates the value of the global
   * settings entity
   */
  updateSettings(key: string, value: any) {
    if (!key || typeof value === 'undefined') {
      return;
    }

    // update value in settings
    this.settingsService
      .set(key, value)
      .subscribe(() => {
        this.loadAppointments();
        this.loadSettings();
      });
  }
}
