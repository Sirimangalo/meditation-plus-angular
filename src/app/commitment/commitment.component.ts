import { Component } from '@angular/core';
import { CommitmentService } from './commitment.service';
import { UserService } from '../user/user.service';
import { AppState } from '../app.service';

@Component({
  selector: 'commitment',
  templateUrl: './commitment.component.html',
  styleUrls: [
    './commitment.component.styl'
  ]
})
export class CommitmentComponent {

  // commitment data
  commitments: Object[] = [];
  subscribedCommitments: Object = {};
  profile;
  loadedInitially = false;

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
        this.loadSubscribedCommitments();
      });
  }

  /**
   * Loads subscribed commitments with progress
   */
  loadSubscribedCommitments() {
    this.commitmentService
      .getCurrentUser()
      .map(res => res.json())
      .subscribe(res => this.subscribedCommitments = res);
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
      .subscribe(
        () => this.loadCommitments(),
        err => console.error(err)
      );
  }

  /**
   * Uncommits from Commitment
   */
  uncommit(evt, commitment) {
    evt.preventDefault();

    this.commitmentService.uncommit(commitment)
      .subscribe(
        () => this.loadCommitments(),
        err => console.error(err)
      );
  }

  /**
   * Checks whether user is committed to commitment.
   */
  committed(commitment) {
    if (!commitment.users) {
      return false;
    }

    const userId = this.getUserId();

    for (const user of commitment.users) {
      if (user._id === userId) {
        return true;
      }
    }
    return false;
  }
}
