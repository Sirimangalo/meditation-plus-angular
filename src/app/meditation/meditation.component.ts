import { Component } from '@angular/core';
import { MeditationService } from './meditation.service';
import { UserService } from '../user/user.service';
import { Response } from '@angular/http';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs/Rx';
import * as moment from 'moment';
import { AppState } from '../app.service';
import * as StableInterval from 'stable-interval';

/**
 * Component for the meditation tab inside home.
 */
@Component({
  selector: 'meditation',
  template: require('./meditation.component.html'),
  styles: [
    require('./meditation.component.css')
  ]
})
export class MeditationComponent {

  // user profile
  profile;

  // timer & alarm bell
  timerScriptBell = null;
  timerStableBell = null;
  timerScript = null;

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

    if (this.ownSession){
      this.appState.set('isMeditating', true);
    } else {
      this.appState.set('isMeditating', false);
    }
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

      // resume timer after page refresh
      // won't work on mobile devices
      if (this.ownSession && (this.ownSession.walkingLeft || this.ownSession.sittingLeft)
        && !this.timerStableBell && !this.timerScript) {
        this.setTimerStable(this.ownSession.walkingLeft, this.ownSession.sittingLeft);
      }
    },
    err => {
      if (err.status === 401) {
        this.userService.logout();
        this.router.navigate(['/']);
      }
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

    // set user status
    this.userWalking = walking > 0;
    this.userSitting = sitting > 0;

    // activate audio for mobile users
    this.timerStableBell = new Audio();
    this.timerStableBell.src = 'assets/audio/halfsec.mp3';
    this.timerStableBell.play();

    this.timerScriptBell = new Audio();
    this.timerScriptBell.src = 'assets/audio/halfsec.mp3';
    this.timerScriptBell.play();

    this.setTimerStable(walking, sitting);

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
   * Method for a stable timer using HTML5 audio API.
   */
  setTimerStable(walking: number, sitting: number) {
    if (this.profile && !this.profile.staticBell) {
      this.setTimerScript(walking, sitting);
      return;
    }

    if (!this.timerStableBell) {
      this.timerStableBell = new Audio();
    }

    this.timerStableBell.onerror = () => {
      // fallback to script timer if error occurs
      this.setTimerScript(walking, sitting);
    };

    const bellName = this.profile.sound.replace(/\/assets\/audio\/|.mp3/g, '');

    // try to load static bell file from server
    if (!walking || !sitting) {
      this.timerStableBell.src = 'https://share.sirimangalo.org/alarms/'
                                    + bellName + '/' + (walking ? walking : sitting) + '.ogg';
    } else {
      this.timerStableBell.src = 'https://share.sirimangalo.org/alarms/'
                                    + bellName + '/' + walking + '_' + sitting + '.ogg';
    }

    this.timerStableBell.currentTime = 0;
    this.timerStableBell.play();
  }

  /**
   * Method for a default script timer using JavaScript (+ 'StableInterval').
   */
  setTimerScript(walking: number, sitting: number) {
    if (this.profile && !this.profile.sound) {
      return;
    }

    if (!this.timerScriptBell) {
      this.timerScriptBell = new Audio();
    }

    const timerStart = moment();

    let walkingDone = walking > 0 ? false : true;
    let sittingDone = sitting > 0 ? false : true;

    this.timerScript = new StableInterval();
    this.timerScriptBell.src = this.profile.sound;

    this.timerScript.set(() => {
      let diff = moment().diff(timerStart, 'minutes');

      if (!walkingDone && diff >= walking) {
        this.timerScriptBell.currentTime = 0;
        this.timerScriptBell.play();
        walkingDone = true;
      }

      if (!sittingDone && diff >= walking + sitting) {
        this.timerScriptBell.currentTime = 0;
        this.timerScriptBell.play();
        sittingDone = true;
      }

      if (walkingDone && sittingDone) {
        this.timerScript.clear();
      }
    }, 5000);
  }

  /**
   * Stopping active timer.
   */
  timerStop() {
    if (this.timerStableBell) {
      this.timerStableBell.pause();
      this.timerStableBell = null;
    }

    if (this.timerScript) {
      this.timerScript.clear();
      this.timerScript = null;
      this.timerScriptBell = null;
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

    this.meditationService.stop()
      .subscribe(() => {
        this.userWalking = false;
        this.userSitting = false;
        this.loadMeditations();
      }, err => {
        console.error(err);
      });

    this.timerStop();
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
