import { Component, ApplicationRef, OnInit, OnDestroy } from '@angular/core';
import { AppointmentService } from './appointment.service';
import { Response } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs/Rx';
import { AppState } from '../app.service';
import { UserService } from '../user/user.service';
import { SettingsService } from '../shared/settings.service';
import * as moment from 'moment-timezone';
import * as $script from 'scriptjs';
// tslint:disable-next-line
import * as timezones from 'timezones.json';

// HACK: for Google APIs
declare var gapi: any;

@Component({
  selector: 'appointment',
  templateUrl: './appointment.component.html',
  styleUrls: [
    './appointment.component.styl'
  ]
})
export class AppointmentComponent implements OnInit, OnDestroy {

  appointments: Object[] = [];
  appointmentSocket;
  rightBeforeAppointment = false;
  loadedInitially = false;
  userHasAppointment = false;
  currentTab = 'table';

  localTimezone: string;
  rootTimezone = 'America/Toronto';
  rootTimezoneShort = moment.tz(this.rootTimezone).zoneName();

  profile;

  nextAppointments: any[] = [];
  countdown: string;
  countdownSub: Subscription;

  constructor(
    public appointmentService: AppointmentService,
    public appRef: ApplicationRef,
    public appState: AppState,
    public route: ActivatedRoute,
    public userService: UserService,
    public settingsService: SettingsService
  ) {
    this.appState.set('title', 'Schedule');
    this.route.params
      .filter(res => res.hasOwnProperty('tab'))
      .subscribe(res => this.currentTab = (<any>res).tab);

  }

  installIntervalTimer() {
    // periodically update countdown
    this.countdownSub = Observable.interval(5000)
      .subscribe(() => this.setCountdown());

    this.settingsService.get()
      .map(res => res.json())
      .subscribe(res => {
        if (!res) {
          return;
        }

        this.rootTimezone = res.appointmentsTimezone;
        this.rootTimezoneShort = moment.tz(this.rootTimezone).zoneName();
      });
  }

  /**
   * Sets the label for remaining time until next appointment
   */
  setCountdown(): void {
    if (this.nextAppointments.length === 0) {
      this.countdown = '';
      return;
    }

    const timeDiff = this.getTimeDiff(this.nextAppointments[0]);

    // remove current appointment from stack if it is in the past
    if (timeDiff.asMinutes() < 0) {
      this.nextAppointments.shift();
      this.setCountdown();
      return;
    }

    this.countdown =
      (timeDiff.hours()
        ?  moment.duration(timeDiff.hours(), 'hours').humanize() + ' and '
        : '')
      + timeDiff.minutes() + ' minutes';
  }

  /**
   * Returns the user id stored in localStorage
   */
  getUserId(): string {
    return this.userService.getUserId();
  }

  /**
   * Returns wether user is admin or not
   */
  get isAdmin(): boolean {
    return this.userService.isAdmin();
  }

  getCurrentMoment(): moment.Moment {
    return moment.tz(this.rootTimezone);
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

        const currentMoment = this.getCurrentMoment();
        const currentDay = currentMoment.weekday();
        const currentHour = parseInt(currentMoment.format('HHmm'), 10);

        this.nextAppointments = [];

        // find current user and check if appointment is now
        for (const appointment of res.appointments) {
          const isUser = appointment.user && appointment.user._id === this.getUserId();

          if (currentDay === appointment.weekDay && currentHour < appointment.hour
            && (isUser || this.isAdmin && appointment.user)) {
            this.nextAppointments.push(appointment);
            if (this.nextAppointments.length === 1) {
              this.setCountdown();
            }
          }

          if (!isUser) {
            continue;
          }

          this.userHasAppointment = true;

          if (Math.abs(this.getTimeDiff(appointment).asMinutes()) <= 5) {
            this.activateHangoutsButton();
            break;
          }
        }


        return res;
      })
      .subscribe(res => this.appointments = res);
  }

  /**
   * Calculates the minutes until a given appointment
   *
   * @param  {Object}     appointment  An appointment
   * @return {number}                  minutes until appointment
   */
  getTimeDiff(appointment) {
    const today = this.getCurrentMoment().weekday();
    const time = this.printHour(appointment.hour).split(':');
    const appointmentMoment = moment
      .tz(this.rootTimezone)
      .day(appointment.weekDay + (today > appointment.weekDay ? 7 : 0))
      .hour(parseInt(time[0], 10))
      .minute(parseInt(time[1], 10))
      .seconds(0)
      .milliseconds(0);
    const currentMoment = this.getCurrentMoment().millisecond(0);

    return moment.duration(appointmentMoment.diff(currentMoment));
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
   * Registration handling
   */
  toggleRegistration(evt, appointment) {
    evt.preventDefault();

    // disallow registration for taken time slots
    if (appointment.user && appointment.user._id !== this.getUserId()) {
      return;
    }

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
  removeRegistration(evt, appointment) {
    evt.preventDefault();

    if (!this.isAdmin) {
      return;
    }

    if (!confirm('Are you sure?')) {
      return;
    }

    this.appointmentService.deleteRegistration(appointment)
      .subscribe(() => {
        this.loadAppointments();
      }, (err) => {
        console.error(err);
      });

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

  /**
   *  Tries to identify the user's timezone
   */
  getLocalTimezone(): string {
    if (this.profile && this.profile.timezone) {
      // lookup correct timezone name from profile model
      for (const k of timezones) {
        // check if timezone is compatible with moment-timezone
        if (k.value === this.profile.timezone && moment().tz(k.utc[1])) {
          return k.utc[1];
        }
      }
    }

    // guess timezone otherwise
    return moment.tz.guess();
  }

  /**
   * Converts EST/EDT datetime by hour to UTC
   */
  getUtcHour(hour: number) {
    return moment.tz(this.printHour(hour), 'HH:mm', this.rootTimezone).tz('UTC').format('HH:mm');
  }

  /**
   * Converts EST/EDT hour to local hour.
   * @param  {number} hour EST/EDT hour
   * @return {string}      Local hour
   */
  getLocalHour(hour: number): string {
    if (!this.localTimezone) {
      this.localTimezone = this.getLocalTimezone();
    }

    // read time for EST/EDT timezone
    const eastern = moment.tz(this.printHour(hour), 'HH:mm', this.rootTimezone);
    const local = eastern.clone().tz(this.localTimezone);

    // check if appointment falls to the next day
    if (eastern.day() < local.day()) {
      return local.format('HH:mm') + ' (+1 day)';
    } else if (eastern.day() > local.day()) {
      return local.format('HH:mm') + ' (-1 day)';
    }

    // convert EST/EDT time to users timezone and return formatted hour
    return local.format('HH:mm');
  }

  weekDay(weekDay: string): string {
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][weekDay];
  }

  getButtonColor(tab: string) {
    return this.currentTab === tab ? 'primary' : '';
  }

  isCurrentTab(tab: string): boolean {
    return this.currentTab === tab;
  }

  ngOnInit() {
    this.installIntervalTimer();
    this.loadAppointments();

    // initialize websocket for instant data
    this.appointmentSocket = this.appointmentService.getSocket()
      .subscribe(() => {
        this.loadAppointments();
      });

    this.userService.getProfile(this.getUserId())
      .map(res => res.json())
      .subscribe(
        res => {
          this.profile = res;
          this.localTimezone = this.getLocalTimezone();
        },
        err => console.log(err)
      );
  }

  ngOnDestroy() {
    this.appointmentSocket.unsubscribe();
    if (this.countdownSub) {
      this.countdownSub.unsubscribe();
    }
  }
}
