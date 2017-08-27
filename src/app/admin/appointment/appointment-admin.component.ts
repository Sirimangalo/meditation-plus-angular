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

  // notification stati
  tickerSubscribed: Boolean;
  tickerLoading: Boolean;
  settings;
  subscription;

  // EDT or EST
  zoneName: string = moment.tz('America/Toronto').zoneName();

  constructor(
    public appointmentService: AppointmentService,
    private settingsService: SettingsService,
    private userService: UserService
  ) {
    this.loadAppointments();
    this.loadSettings();

    // Ask permission to send PUSH NOTIFICATIONS
    // for appointment notifications
    if (navigator && 'serviceWorker' in navigator) {
      navigator['serviceWorker'].ready.then(reg =>
        reg.pushManager.subscribe({ userVisibleOnly: true }).then(subscription =>
          // register subscription in case it's not yet registered
          this.userService
            .registerPushSubscription(subscription)
            .subscribe(() => {
              // save subscription data
              this.subscription = subscription;
              this.tickerSubscribed = this.settings && this.settings.appointmentsTicker
                && this.settings.appointmentsTicker.indexOf(subscription.endpoint) > -1;
            })
        )
      );
    }
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
        this.increment = res.appointmentsIncrement
          ? res.appointmentsIncrement
          : 0;
      });
  }

  /**
   * Changes the settings for the current device
   * to receive constant appointment notifications
   */
  toggleTicker() {
    if (!this.subscription) {
      return;
    }

    this.tickerLoading = true;

    // update settings
    const tickerSubs = this.settings && this.settings.appointmentsTicker
      ? this.settings.appointmentsTicker
      : [];

    // toggle subscription of appointments in settings
    const i = tickerSubs.indexOf(this.subscription.endpoint);
    if (i >= 0) {
      // remove from array
      tickerSubs.splice(i, 1);
    } else {
      // add to array
      tickerSubs.push(this.subscription.endpoint);
    }

    this.settingsService
      .set('appointmentsTicker', tickerSubs)
      .subscribe(() => {
        this.loadSettings();
        this.tickerLoading = false;
        this.tickerSubscribed = !this.tickerSubscribed;
      });
  }

  /**
   * Updates the value of the global
   * appointment increment
   */
  updateIncrement() {
    // update value in settings
    this.settingsService
      .set('appointmentsIncrement', this.increment)
      .subscribe(() => {
        this.loadAppointments();
        this.loadSettings();
      });
  }
}
