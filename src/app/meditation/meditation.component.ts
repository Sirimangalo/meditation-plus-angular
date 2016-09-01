import { Component } from '@angular/core';
import { MeditationService } from './meditation.service';
import { UserService } from '../user/user.service';
import { Response } from '@angular/http';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs/Rx';
import * as moment from 'moment';
import { MeditationListEntryComponent } from './list-entry/list-entry.component';
import { AvatarDirective } from '../profile';
import { AppState } from '../app.service';
import { MeditationChartComponent } from './chart/meditation-chart.component';
import * as stableTimer from 'stable-timer';

/**
 * Component for the meditation tab inside home.
 */
@Component({
  selector: 'meditation',
  template: require('./meditation.html'),
  directives: [
    MeditationChartComponent,
    MeditationListEntryComponent,
    AvatarDirective
  ],
  styles: [
    require('./meditation.css')
  ]
})
export class MeditationComponent {

  // user profile
  profile;

  // alarm bell
  bell;
  timerWalking;
  timerSitting;
  timerHeartbeat;

  // meditation data
  activeMeditations: Object[];
  finishedMeditations: Object[];
  meditationSubscription;
  meditationSocket;
  ownSession = null;
  loadedInitially: boolean = false;
  lastUpdated;
  sending: boolean = false;
  lastMeditationSession;

  // form data
  walking: string = '';
  sitting: string = '';

  // current User data
  currentMeditation: string = '';
  userWalking: boolean = false;
  userSitting: boolean = false;

  loadingLike: boolean = false;

  constructor(
    public meditationService: MeditationService,
    public userService: UserService,
    public router: Router,
    public appState: AppState
  ) {
    this.polluteWithLastSession();
  }

  /**
   * Method will be fired when the tab in home is activated.
   */
  onActivated() {
    this.polluteWithLastSession();
  }

  /**
   * Set current walking and sitting inputs to last values.
   */
  polluteWithLastSession() {
    this.walking = window.localStorage.getItem('lastWalking');
    this.sitting = window.localStorage.getItem('lastSitting');
  }

  /**
   * Checks if the current user is meditating sets the session if found.
   */
  checkOwnSession() {
    this.ownSession = this.activeMeditations && this.activeMeditations
      .filter(val => (<any>val).user._id === this.getUserId())
      .reduce((prev, val) => val, null);
  }

  /**
   * Start polling observable
   */
  pollMeditations(): Observable<Response> {
    return Observable.interval(1000)
      .filter(() => {
        if (!this.lastUpdated) {
          return true;
        }

        // only update when a minute is reached
        const duration = moment.duration(moment().diff(this.lastUpdated));
        return duration.asMinutes() > 1;
      })
      .switchMap(() => this.meditationService.getRecent())
      .map(res => (<any>res).json())
      .retry();
  }

  /**
   * Returns the user id stored in localStorage
   */
  getUserId(): string {
    return window.localStorage.getItem('id');
  }

  /**
   * Filters the response by active and finished meditations
   * @param {Observable<any>} res
   */
  subscribe(obs: Observable<any>): Subscription {
    return obs.subscribe(res => {
      this.loadedInitially = true;
      this.lastUpdated = moment();

      // reset title
      this.appState.set('title', null);

      this.activeMeditations = res.filter(data => {
        // set title to own meditation session state
        if (data.user._id === this.getUserId() && (data.walkingLeft + data.sittingLeft) > 0) {
          this.appState.set(
            'title',
            (this.userWalking ? 'Walking' : 'Sitting') +
            ' Meditation (' + (data.walkingLeft ? data.walkingLeft : data.sittingLeft) + 'm left)'
          );
        }

        // updated latest meditation session date
        if (!this.lastMeditationSession
          || moment(data.createdAt) > this.lastMeditationSession) {
          this.lastMeditationSession = moment(data.createdAt);
        }

        // also checking here if walking or sitting finished for the current user
        // to play a sound. Doing it inside the filter to reduce iterations.
        if (data._id === this.currentMeditation && this.userWalking && !data.walkingLeft){
          this.userWalking = false;
        } else if (data._id === this.currentMeditation && this.userSitting && !data.sittingLeft) {
          this.userSitting = false;
        }

        // actual filtering for active meditations
        return data.sittingLeft + data.walkingLeft > 0;
      });

      this.finishedMeditations = res.filter(data => {
        return data.sittingLeft + data.walkingLeft === 0;
      });

      this.checkOwnSession();
    });
  }

  /**
   * Method for querying recent meditations
   */
  loadMeditations(): void {
    this.subscribe(
      this.meditationService.getRecent()
      .map(res => res.json())
    );
  }

  /**
   * Sends new meditation session
   */
  sendMeditation(evt) {
    evt.preventDefault();
    let walking = this.walking ? parseInt(this.walking, 10) : 0;
    let sitting = this.sitting ? parseInt(this.sitting, 10) : 0;

    if (!walking && !sitting)
      return;

    // saves last meditation data to localStorage
    window.localStorage.setItem('lastWalking', this.walking);
    window.localStorage.setItem('lastSitting', this.sitting);

    this.sending = true;
    this.meditationService.post(walking, sitting)
      .map(res => res.json())
      .subscribe(res => {
        this.currentMeditation = res._id;
        this.loadMeditations();
        this.sending = false;
      }, (err) => {
        console.error(err);
        this.sending = false;
      });

    // Set user status
    this.userWalking = walking > 0;
    this.userSitting = sitting > 0;

    // Activate bell for mobile users
    if (this.bell){
      this.bell.currentTime = 0;
      this.bell.play();
      this.bell.pause();
    }

    this.setTimer(walking * 60000, sitting * 60000);
    this.appState.set('isMeditating', true);
  }

  /**
   * Method for liking meditation sessions of other users.
   */
  like() {
    this.loadingLike = true;
    this.meditationService.like()
      .subscribe(
        () => {
          this.loadingLike = false;
          this.profile.lastLike = moment();
        },
        () => this.loadingLike = false
      );
  }

  /**
   * Method for starting a meditation timer in the user's browser
   * @param {number} time for walking in milliseconds
   * @param {number} time for sitting in milliseconds
   */
  setTimer(walking: number, sitting: number) {
    // Does a redundant task every minute
    // Tries to keep tab alive in background for long sessions on mobile devices
    // EXPERIMENTAL
    this.timerHeartbeat = stableTimer.setInterval(() => {
      console.log('Namo Tassa Bhagavato Arahato Sammāsambuddhassa');
    }, 60000);

    // Set timer for walking and sitting meditation
    if (walking > 0) {
      this.timerWalking = stableTimer.setTimeout(() => {
        this.playSound();
      }, walking);
    }
    if (sitting > 0) {
      this.timerSitting = stableTimer.setTimeout(() => {
        this.playSound();
      }, walking + sitting);
    }
  }

  /**
   * Play sound. Needed for bells.
   */
  playSound() {
    if (this.bell){
      this.bell.currentTime = 0;
      this.bell.play();
    }
  }

  /**
   * Stopping active meditation session.
   */
  stop() {
    if (!confirm(
      'Are you sure you want to stop your session?'
    )) {
      return;
    }

    // Disable alarm bell
    stableTimer.clearInterval(this.timerHeartbeat);
    stableTimer.clearTimeout(this.timerWalking);
    stableTimer.clearTimeout(this.timerSitting);

    this.meditationService.stop()
      .subscribe(() => {
        this.userWalking = false;
        this.userSitting = false;
        this.loadMeditations();
      }, err => {
        console.error(err);
      });

    this.appState.set('isMeditating', false);
  }

  ngOnInit() {
    // getting chat data instantly
    this.loadMeditations();

    // subscribe for an refresh interval after
    this.meditationSubscription = this.subscribe(
      this.pollMeditations()
    );

    // initialize websocket for instant data
    this.meditationSocket = this.meditationService.getSocket()
      .subscribe(() => {
        this.loadMeditations();
      });

    // Get user profile data (for preferred sound and last meditation time)
    this.userService.getProfile()
      .map(res => res.json())
      .subscribe(
        data => {
          this.profile = data;
          this.profile.lastLike = this.profile.lastLike ? moment(this.profile.lastLike) : null;
          if (this.profile.sound){
            this.bell = new Audio(this.profile.sound);
          }
        },
        err => console.error(err)
      );
  }

  /**
   * Rounds a number. Math.round isn't available in the template.
   * Needed for meditation progress.
   *
   * @param  {number} val Value to round
   * @return {number}     Rounded value
   */
  round(val: number): number {
    return Math.round(val);
  }

  ngOnDestroy() {
    this.meditationSubscription.unsubscribe();
    this.meditationSocket.unsubscribe();
  }
}
