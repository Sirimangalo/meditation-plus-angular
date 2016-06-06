import { Component } from '@angular/core';
import { CommitmentService } from './commitment.service';
import { Response } from '@angular/http';
import { Router } from '@angular/router-deprecated';
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

  constructor(
    public commitmentService: CommitmentService,
    public router: Router
  ) {
    this.loadCommitments();
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
   * TODO: implement
   */
  reached(commitment) {
    return 0;
  }
}
