import { Component, ApplicationRef, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material';
import { MeetingService } from './meeting.service';
import { AppState } from '../app.service';
import * as $script from 'scriptjs';
import 'rxjs/add/observable/interval';

// HACK: for Google APIs
declare var gapi: any;

@Component({
  selector: 'meeting',
  templateUrl: './meeting.component.html',
  styleUrls: [
    './meeting.component.styl',
  ]
})
export class MeetingComponent implements OnDestroy {

  meeting: Object = null;
  appointment: Object = null;

  loading = true;
  videochat = false;
  ended = false;

  error: string;

  history: any[] = [];
  historySize = 0;
  page = 0;
  pageSizeOptions = [5, 10, 25, 100];
  previewMeeting;

  constructor(
    public meetingService: MeetingService,
    private appRef: ApplicationRef,
    public appState: AppState
  ) {
    this.loadMeeting();

    this.meetingService.on('update')
      .subscribe(res => {
        if (!res) {
          return;
        }

        console.log(res);
        this.meeting = res;
      });
  }

  /**
   * Loads history of old meetings that is shown
   * when there is no meeting or appointment.
   */
  loadHistory(evt: PageEvent = null): void {
    let page = 0;
    let pageSize = 5;

    if (evt) {
      page = evt.pageIndex;
      pageSize = evt.pageSize;
    }

    this.meetingService.getAll(page, pageSize)
      .map(res => res.json())
      .subscribe(
        res => {
            console.log("res", res);
          this.loading = false;
          this.history = res.meetings;
          this.historySize = res.length;
        },
        () => this.loading = false
      );
  }

  /**
   * Loads an appointment that the user is allowed
   * to join right now.
   */
  loadAppointment(): void {
    this.loading = true;
    this.meetingService.getAppointment()
      .map(res => res.json())
      .subscribe(
        res => {
          this.loading = false;
          this.appointment = res;
        },
        () => this.loadHistory()
      );
  }
  /**
   * Loads a meeting that the user has already joined.
   */
  loadMeeting(): void {
    this.loading = true;
    this.meetingService.getNow()
      .map(res => res.json())
      .subscribe(
        res => {
          this.loading = false;
          this.meeting = res;
          this.activateHangoutsButton();
        },
        () => this.loadAppointment()
      );
  }

  /**
   * Join a meeting.
   */
  joinMeeting(): void {
    this.meetingService.join()
      .map(res => res.json())
      .subscribe(
        res => this.meeting = res,
        err => this.showError(err.text())
      );
  }

  /**
   * Initiates video chat
   */
  joinVideoChat(): void {
    // hide toolbar
    this.appState.set('hideToolbar', true);
    this.videochat = true;
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
    this.appState.set('hideToolbar', false);

    if (!evt || typeof evt !== 'string') {
      return;
    }

    this.error = evt;
  }

  /**
   * Shows exit screen and reload page
   */
  showEndingScreen(): void {
    this.ended = true;
    setTimeout(() => window.location.reload(), 3000);
  }

  /**
   * Show chat messages of past meeting in videochat interface
   */
  preview(meeting): void {
    if (!meeting || !meeting.messages || !(meeting.messages.length > 0)) {
      return;
    }

    this.appState.set('hideToolbar', true);
    this.previewMeeting = meeting;
  }

  previewEnded(): void {
    this.previewMeeting = null;
    this.appState.set('hideToolbar', false);
  }

  get isAdmin(): boolean {
    return window.localStorage.getItem('role') === 'ROLE_ADMIN';
  }

  closeMeeting(): void {

  }

  ngOnDestroy(): void {
    this.appState.set('hideToolbar', false);
  }
}
