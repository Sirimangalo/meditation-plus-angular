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

  // appointment data
  appointments: Object[] = [];
  increment = 0;
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
      .getAll()
      .map(res => res.json())
      .map(res => res.appointments)
      .subscribe(res => this.appointments = res);
  }

  printWeekDay(weekDay: number): string {
    return moment('' + weekDay, 'e').format('ddd');
  }

  delete(evt, appointment) {
    evt.preventDefault();

    if (!confirm('Are you sure?')) {
      return;
    }

    this.appointmentService
      .delete(appointment)
      .subscribe(() => this.loadAppointments());
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
        this.increment = res.appointmentsIncrement
          ? res.appointmentsIncrement
          : 0;
      });
  }

  /**
   * Updates the value of the global
   * appointment increment
   */
  updateSettings(key: string, value: any) {
    if (!key || typeof(value) === 'undefined') {
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
