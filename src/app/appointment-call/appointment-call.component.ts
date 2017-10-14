import { Component, ApplicationRef, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs/Rx';
import { AppointmentService } from '../appointment/appointment.service';
import { UserService } from '../user/user.service';
import { SettingsService } from '../shared/settings.service';
import { AppState } from '../app.service';
import * as moment from 'moment-timezone';
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
export class AppointmentCallComponent implements OnDestroy {

  appointment: Object;
  // true if somebody else has already joined
  started: boolean;
  settings: any;

  loading = true;
  // true after clicking the 'Join appointment button'
  initiated: boolean;
  ended: boolean;
  error: string;

  updateSubscription: Subscription;

  constructor(
    private appointmentService: AppointmentService,
    private appRef: ApplicationRef,
    public appState: AppState,
    private route: ActivatedRoute,
    private userService: UserService,
    private settingsService: SettingsService
  ) {
    // load settings
    this.settingsService.get()
      .map(res => res.json())
      .subscribe(res => this.settings = res);

    // load & listen for appointment call
    this.loadAppointment();
    this.updateSubscription = Observable.interval(2500)
      .subscribe(() => this.loadAppointment());
  }

  /**
   * Tries to load appointment for current user
   */
  loadAppointment(): void {
    this.appointmentService.getNow()
      .subscribe(
        res => {
          this.loading = false;

          if (res.appointment) {
            // activate hangout button only the first time
            if (!this.appointment) {
              this.activateHangoutsButton();
            }

            this.appointment = res.appointment;
            this.started = res.started;
          }
        },
        err => console.error(err)
      );
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
   * Reloads page
   */
  reload(): void {
    window.location.reload();
  }

  /**
   * Shows an error message
   */
  showError(evt): void {
    // unhide toolbar
    this.appState.set('hideToolbar', true);

    if (!evt || typeof evt !== 'string') {
      return;
    }

    this.error = evt;
  }

  /**
   * Initiates call
   */
  initiate(): void {
    // destroy waiting subscription
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }

    // hide toolbar
    this.appState.set('hideToolbar', true);
    this.initiated = true;
  }

  /**
   * Shows exit screen and reload page
   */
  showEndingScreen(): void {
    this.ended = true;
    setTimeout(() => window.location.reload(), 3000);
  }

  ngOnDestroy(): void {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }
}
