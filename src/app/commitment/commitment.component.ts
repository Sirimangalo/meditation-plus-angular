import { Component } from '@angular/core';
import { CommitmentService } from './commitment.service';
import { UserService } from '../user/user.service';
import { Response } from '@angular/http';
import { Observable, Subscription } from 'rxjs/Rx';
import * as moment from 'moment';

@Component({
  selector: 'commitment',
  template: require('./commitment.html'),
  styles: [
    require('./commitment.css')
  ]
})
export class CommitmentComponent {

  // commitment data
  commitments: Object[] = [];
  profile;
  reachedCache: Map<string, number> = new Map<string, number>();

  constructor(
    public commitmentService: CommitmentService,
    public userService: UserService
  ) {
    this.loadCommitments();

    // load own profile to calculate achievements
    this.userService.getProfile(window.localStorage.getItem('username'))
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
      .subscribe(res => this.commitments = res);
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
      for (let key of Object.keys(this.profile.meditations)) {
        sum += this.profile.meditations[key];
      }

      // build the average and compare it to goal
      let avg = sum / Object.keys(this.profile.meditations).length;
      let result = Math.round(100 * avg / commitment.minutes);

      this.reachedCache.set(commitment._id, result);
      return result;
    }

    if (commitment.type === 'weekly') {
      let sum = 0;

      // Sum minutes per day for the last week
      for (let key of Object.keys(this.profile.meditations)) {
        sum += this.profile.meditations[key];
      }

      // compare it to goal
      let result = Math.round(100 * sum / commitment.minutes);

      this.reachedCache.set(commitment._id, result);
      return result;
    }
  }
}
