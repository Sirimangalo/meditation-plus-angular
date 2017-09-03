import { Component } from '@angular/core';
import { AppointmentService } from '../../appointment';
import { UserService } from '../../user';
import { SettingsService } from '../../shared';
import * as moment from 'moment-timezone';

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
    private settingsService: SettingsService,
    private userService: UserService
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

  /**
   * Converts hour from number to string.
   * @param  {number} hour EST/EDT hour from DB
   * @return {string}      Local hour in format 'HH:mm'
   */
  printHour(hour: number): string {
    hour = hour < 0 || hour >= 2400 ? 0 : hour;

    const hourStr = '0000' + hour.toString();
    return hourStr.substr(-4, 2) + ':' + hourStr.substr(-2, 2);
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
