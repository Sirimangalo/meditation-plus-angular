import { Component } from '@angular/core';
import { PageEvent } from '@angular/material';
import { MeetingService } from '../meeting.service';
import { UserService } from '../../user/user.service';
import { Meeting } from '../meeting';

@Component({
  selector: 'meeting-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.styl']
})
export class HistoryComponent {
  loading = false;

  history: any[] = [];
  historySize = 0;
  page = 0;
  pageSizeOptions = [5, 10, 25, 100];

  constructor(
    private meetingService: MeetingService,
    private userService: UserService
  ) {
    this.loadHistory();
  }

  /**
   * Returns the user id stored in localStorage
   */
  getUserId(): string {
    return this.userService.getUserId();
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

    this.loading = true;
    this.meetingService
      .getHistory(page, pageSize)
      .map(res => res.json())
      .subscribe(
        res => {
          this.loading = false;
          this.history = res.meetings;
          this.historySize = res.length;
        },
        () => this.loading = false
      );
  }

  getOpponent(meeting: Meeting) {
    return meeting.participants.filter(p => p !== this.getUserId())[0];
  }
}
