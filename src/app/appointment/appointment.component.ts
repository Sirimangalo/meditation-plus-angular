import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppointmentService } from './appointment.service';
import { Response } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs/Rx';
import { AppState } from '../app.service';
import { UserService } from '../user/user.service';
import * as moment from 'moment-timezone';
// tslint:disable-next-line
import * as timezones from 'timezones.json';

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

  localTimezone;
  rootTimezone: string = moment.tz('America/Toronto').format('z');

  profile;

  increment: number;

  constructor(
    public appointmentService: AppointmentService,
    public appState: AppState,
    public route: ActivatedRoute,
    public userService: UserService
  ) {
    this.appState.set('title', 'Schedule');
    this.route.params
      .filter(res => res.hasOwnProperty('tab'))
      .subscribe(res => this.currentTab = (<any>res).tab);
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
      .subscribe(res => {
        this.loadedInitially = true;
        this.appointments = res
      });
  }

  /**
   * Load increment parameter for appointment hours
   */
  loadIncrement() {
    this.appointmentService
      .getIncrement()
      .map(res => res.json())
      .subscribe(res => this.increment = res);
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
    hour = hour + this.increment * 100;
    hour = hour < 0 || hour >= 2400 ? 0 : hour;

    // add padding with '0' (i.e. 40 => '0040')
    const hourFormat = Array(5 - hour.toString().length).join('0') + hour.toString();

    return moment(hourFormat, 'HHmm').format('HH:mm');
  }

  /**
   *  Tries to identify the user's timezone
   */
  getLocalTimezone() {
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
    return moment.tz(this.printHour(hour), 'HH:mm', 'America/Toronto').tz('UTC').format('HH:mm');
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
    const eastern = moment.tz(this.printHour(hour), 'HH:mm', 'America/Toronto');
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
    this.loadAppointments();
    this.loadIncrement();

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

    this.appointmentService.getNow()
      .subscribe(res => this.rightBeforeAppointment = res !== null);
  }

  ngOnDestroy() {
    this.appointmentSocket.unsubscribe();
  }
}
