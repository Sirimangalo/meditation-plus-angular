import { Component } from '@angular/core';
import { CommitmentService } from './commitment.service';
import { UserService } from '../user/user.service';
import { Response } from '@angular/http';
import { Observable, Subscription } from 'rxjs/Rx';
import { AppState } from '../app.service';
import * as moment from 'moment';

@Component({
  selector: 'commitment',
  template: require('./commitment.component.html'),
  styles: [
    require('./commitment.component.css')
  ]
})
export class CommitmentComponent {

  // commitment data
  commitments: Object[] = [];
  profile;
  reachedCache: Map<string, number> = new Map<string, number>();
  loadedInitially: boolean = false;

  constructor(
    public commitmentService: CommitmentService,
    public userService: UserService,
    public appState: AppState
  ) {
    this.appState.set('title', 'Commitments');

    this.loadCommitments();

    // load own profile to calculate achievements
    this.userService.getProfile(window.localStorage.getItem('id'))
      .map(res => res.json())
      .subscribe(
        res => this.profile = res,
        err => console.error(err)
      );
  }

  /**
   * Loads all commitments
   */
  loadCommitments() {
    this.commitmentService
      .getAll()
      .map(res => res.json())
      .subscribe(res => {
        this.commitments = res;
        this.loadedInitially = true;
      });
  }

  /**
   * Returns the user id stored in localStorage
   */
  getUserId(): string {
    return window.localStorage.getItem('id');
  }

  /**
   * Commits to Commitment
   */
  commit(evt, commitment) {
    evt.preventDefault();

    this.commitmentService.commit(commitment)
      .subscribe(() => {
        this.loadCommitments();
      }, (err) => {
        console.error(err);
      });
  }

  /**
   * Uncommits from Commitment
   */
  uncommit(evt, commitment) {
    evt.preventDefault();

    this.commitmentService.uncommit(commitment)
      .subscribe(() => {
        this.loadCommitments();
      }, (err) => {
        console.error(err);
      });
  }

  /**
   * Checks whether user is committed to commitment.
   */
  committed(commitment) {
    if (!commitment.users) {
      return false;
    }

    let userId = this.getUserId();

    for (let user of commitment.users) {
      if (user._id === userId) {
        return true;
      }
    }
    return false;
  }

  /**
   * Determines the percentage of the reached goal.
   */
  reached(commitment) {
    // Return cache if it exists
    if (this.reachedCache.has(commitment._id)) {
      return this.reachedCache.get(commitment._id);
    }

    if (commitment.type === 'daily') {
      let sum = 0;

      // Sum minutes per day for the last week
      for (let key of Object.keys(this.profile.meditations.lastDays)) {
        const meditated = this.profile.meditations.lastDays[key];
        // Cut meditated minutes to the max of the commitment to preserve
        // a correct average value.
        sum += meditated > commitment.minutes ? commitment.minutes : meditated;
      }

      // build the average and compare it to goal
      let avg = sum / Object.keys(this.profile.meditations.lastDays).length;
      let result = Math.round(100 * avg / commitment.minutes);

      this.reachedCache.set(commitment._id, result);
      return result;
    }

    if (commitment.type === 'weekly') {
      const keys = Object.keys(this.profile.meditations.lastWeeks);

      // Get last entry of lastWeeks
      const lastWeekSum = this.profile.meditations.lastWeeks[keys[keys.length - 1]];

      // compare it to goal
      let result = Math.round(100 * lastWeekSum / commitment.minutes);

      this.reachedCache.set(commitment._id, result);
      return result;
    }
  }
}
