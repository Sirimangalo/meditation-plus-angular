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

  reached(commitment) {
    return this.commitmentService.reached(this.profile.meditations, commitment);
  }
}
