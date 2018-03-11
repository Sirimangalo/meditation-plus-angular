import { Component } from '@angular/core';
import { AppointmentService } from '../../appointment';
import { SettingsService } from '../../shared';
import * as moment from 'moment-timezone';
import 'rxjs/add/operator/map';
import { AppointmentHourVO } from '../../appointment/appointment';

@Component({
  selector: 'appointment-admin',
  templateUrl: './appointment-admin.component.html',
  styleUrls: [
    './appointment-admin.component.styl'
  ]
})
export class AppointmentAdminComponent {
  initialLoading = true;
  confirmDeletions = true;

  // appointment data + feedback flags
  appointments = new Map<string, AppointmentHourVO>();
  keys: string[] = [];
  weekdays: string[] = moment.weekdays();

  timezone: string;
  timezones = moment.tz.names();
  // define standard timezone until 'timezone' is loaded
  zoneName = moment.tz('America/Toronto').zoneName();

  // notification stati
  tickerSubscribed: boolean;
  tickerLoading: boolean;
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
  loadAppointments(): void {
    this.appointmentService
      .getAggregated()
      .map(res => res.json())
      .do(() => this.initialLoading = false)
      .subscribe(res => {
        const prevMap = new Map(this.appointments);
        this.appointments = new Map();

        for (const hour of res) {
          this.appointments.set(hour._id, {
            ...prevMap.get(hour._id) || {},
            ...hour
          });
        }

        this.keys = Array.from(this.appointments.keys());
      });
  }

  /**
   * Loads the settings entity
   */
  loadSettings(): void {
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
   * @param hour The hour to identify the card
   */
  toggleEdit(hour: string): void {
    if (!this.appointments.has(hour)) {
      return;
    }
    const app = this.appointments.get(hour);
    app.status = app.status === 'editing' ? null : 'editing';
  }

  /**
   * Toggle the existence of an appointment (via checkbox in the interface).
   *
   * @param hour Hour of appointment
   * @param day Weekday of appointment
   */
  toggleDay(evt: Event, hour: string, day: number): void {
    if (!this.appointments.has(hour)) {
      return;
    }

    const appointment = this.appointments.get(hour);

    if (this.confirmDeletions && appointment.days.includes(day) && !confirm('Are you sure?')) {
      evt.preventDefault();
      return;
    }

    // reset user feedback
    appointment.status = 'loading';

    this.appointmentService
      .toggle(parseInt(hour, 10), day)
      .subscribe(
        () => appointment.status = 'success',
        err => {
          appointment.errorMessage = err.text();
          appointment.status = 'error';
        },
        () => this.loadAppointments()
      );
  }

  /**
   * Update appointments hours.
   *
   * @param evt      An event
   * @param oldHour  Hour to identify appointments
   * @param newHour  New hour after update
   */
  updateHour(evt: Event, oldHour: any, newHour: any): void {
    if (evt) {
      evt.preventDefault();
    }

    oldHour = parseInt(oldHour, 10);
    newHour = parseInt(newHour, 10);

    if (isNaN(oldHour) || isNaN(newHour) || !this.appointments.has(oldHour)) {
      return;
    }

    const appointment = this.appointments.get(oldHour);
    appointment.status = 'editLoading';
    this.appointmentService
      .update(oldHour, newHour)
      .subscribe(
        () => this.loadAppointments(),
        err => {
          appointment.errorMessage = err.text();
          appointment.status = 'error';
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
