import { Component, ApplicationRef } from '@angular/core';
import { MeetingService } from './meeting.service';
import { UserService } from '../user/user.service';
import { Meeting } from './meeting';
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
export class MeetingComponent {
  meeting: Meeting;

  loading = true;
  closed = false;

  videochat = false;
  videochatActive = false;
  videochatError: string;

  constructor(
    public meetingService: MeetingService,
    public userService: UserService,
    private appRef: ApplicationRef
  ) {
    this.loadMeeting();

    this.meetingService
      .on('update', false)
      .subscribe(() => this.loadMeeting());

    this.meetingService
      .on('joined', false)
      .subscribe(res => {
        if (!res || !this.meeting || this.meeting.participants.length >= 2) {
          return;
        }

        this.meeting.participants.push(res);
      });

    this.meetingService
      .on('calling', false)
      .subscribe(res => this.videochatActive = res === true);

    this.meetingService
      .on('closed', false)
      .subscribe(() => {
        this.meetingService.trigger('leave', false);
        this.meetingService.trigger('leave', true);
        this.meeting = null;
        this.closed = true;
      });
  }

  /**
   * Loads an ongoing meeting
   */
  loadMeeting(): void {
    this.loading = true;
    this.meetingService
      .getNow()
      .map(res => res.json())
      .subscribe(
        res => {
          this.loading = false;
          this.meeting = res;
          this.meetingService.trigger('join', this.meeting._id, false);
          this.activateHangoutsButton();
        },
        () => this.loading = false
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
   * Shows an error message
   */
  showError(evt): void {
    if (typeof evt !== 'string') {
      return;
    }

    this.activateHangoutsButton();
    this.videochat = false;
    this.videochatError = evt;
  }

  exitVideoChat(): void {
    this.activateHangoutsButton();
    this.videochat = false;
  }

  /**
   * Closes an ongoing meeting
   */
  closeMeeting(): void {
    if (!this.meeting) {
      return;
    }

    this.meetingService
      .close(this.meeting._id)
      .subscribe(() => {
        this.meeting = null;
        this.closed = true;
      });
  }

  /**
   * Returns wether user is admin or not
   */
  get isAdmin(): boolean {
    return this.userService.isAdmin();
  }
}
