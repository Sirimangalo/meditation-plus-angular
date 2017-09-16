import { Component, OnInit, OnDestroy } from '@angular/core';
import { MeditationService } from './meditation.service';
import { CommitmentService } from '../commitment/commitment.service';
import { UserService } from '../user/user.service';
import { Response } from '@angular/http';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs/Rx';
import * as moment from 'moment';
import { AppState } from '../app.service';

// tslint:disable-next-line
import * as StableInterval from 'stable-interval';

/**
 * Component for the meditation tab inside home.
 */
@Component({
  selector: 'meditation',
  templateUrl: './meditation.component.html',
  styleUrls: [
    './meditation.component.styl'
  ]
})
export class MeditationComponent implements OnInit, OnDestroy {

  // user profile
  profile;

  // url for static audio file
  bell;
  bellInterval;

  // meditation data
  activeMeditations: Object[];
  finishedMeditations: Object[];
  meditationSubscription;
  meditationSocket;
  ownSession = null;
  loadedInitially = false;
  lastUpdated;
  sending = false;
  lastMeditationSession;

  // form data
  walking = '';
  sitting = '';

  // commit
  commitment;
  commitmentProgress;
  commitmentProgressDaily;

  // current User data
  currentMeditation = '';
  userWalking = false;
  userSitting = false;

  loadingLike = false;

  constructor(
    public meditationService: MeditationService,
    public userService: UserService,
    public commitmentService: CommitmentService,
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

    if (this.ownSession) {
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
        if (data._id === this.currentMeditation && this.userWalking && !data.walkingLeft) {
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
         && !this.bell && !this.bellInterval) {
        this.fallbackTimer(this.ownSession.walkingLeft, this.ownSession.sittingLeft);
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
  sendMeditation(walking, sitting) {
    if (!walking && !sitting) {
      return;
    }

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

    this.appState.set('isMeditating', true);

    // add session time to currently loaded commitment
    this.updateCommitment(walking + sitting);
  }

  getBellUrl(walking: number, sitting: number): string {
    if (!this.profile) {
      return;
    }

    const bellName = this.profile.sound.replace(/\/assets\/audio\/|.mp3/g, '');
    let bellUrl = 'https://share.sirimangalo.org/static/sounds/' + bellName + '/';

    if (!walking || !sitting) {
      bellUrl += (walking ? walking : sitting);
    } else {
      bellUrl += walking + '_' + sitting;
    }

    return bellUrl;
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
   * Event which gets triggered by user after submitting a meditation.
   */
  startMeditation(evt) {
    evt.preventDefault();

    const walking = this.walking ? parseInt(this.walking, 10) : 0;
    const sitting = this.sitting ? parseInt(this.sitting, 10) : 0;

    // send session to server
    this.sendMeditation(walking, sitting);

    // setup timer & bell,
    // prevent 'gesture-requirement-for-media-playback' on mobile browsers
    this.bell = new Audio();
    this.bell.src = '/assets/audio/halfsec.mp3';
    this.bell.play();

    // check for Network API support
    const connection = window.navigator['connection']
      || window.navigator['mozConnection']
      || null;

    // use the more stable HTML5 <audio> solution for playing a bell
    // if the user has activated this feature or we know that he isn't
    // using a cellular connection.
    if (this.profile && this.profile.stableBell ||
        connection && connection.type && connection.type !== 'cellular') {
      // wait for 'halfsec.mp3'
      setTimeout(() => this.stableTimer(walking, sitting), 700);
    } else {
      this.fallbackTimer(walking, sitting);
    }
  }

  fallbackTimer(walking = 0, sitting = 0): void {
    if (!this.profile || !this.profile.sound || walking + sitting <= 0) {
      return;
    }

    if (!this.bell) {
      this.bell = new Audio();
    }

    this.bell.src = this.profile.sound;
    this.bell.onerror = () => console.error('cannot play bell');

    const walkingDone = walking > 0 ? moment().add(walking, 'minutes') : null;
    const sittingDone = sitting > 0 ? moment().add(walking + sitting, 'minutes') : null;

    this.bellInterval = new StableInterval();
    this.bellInterval.set(() => {
      if (moment().isAfter(sittingDone, 'minute') || !this.userWalking && !this.userSitting) {
        this.bellInterval.clear();
      }

      if (walkingDone && moment().isSame(walkingDone, 'minute')) {
        this.bell.currentTime = 0;
        this.bell.play();
      }

      if (walkingDone && moment().isSame(sittingDone, 'minute')) {
        this.bell.currentTime = 0;
        this.bell.play();
      }
    }, 60000);
  }

  stableTimer(walking = 0, sitting = 0): void {
    if (!this.profile || !this.profile.sound || walking + sitting <= 0) {
      return;
    }

    if (!this.bell) {
      this.bell = new Audio();
    }

    this.bell.onerror = err => {
      console.error(err);

      if (new RegExp('\.ogg$').test(this.bell.src)) {
        this.bell.src = this.getBellUrl(walking, sitting) + '.m4a';
        this.bell.currentTime = 0;
        this.bell.play();
      } else {
        this.fallbackTimer(walking, sitting);
      }
    };

    this.bell.src = this.getBellUrl(walking, sitting) + '.ogg';
    this.bell.currentTime = 0;
    this.bell.play();
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

    const meditated = -(this.ownSession.walkingLeft + this.ownSession.sittingLeft);
    this.updateCommitment(meditated);

    this.meditationService.stop()
      .subscribe(() => {
        this.userWalking = false;
        this.userSitting = false;
        this.loadMeditations();
      }, err => {
        console.error(err);
      });

    this.appState.set('isMeditating', false);

    if (this.bell) {
      this.bell.pause();
    }

    if (this.bellInterval) {
      this.bellInterval.clear();
    }
  }

  /**
   * Update status of currently loaded commitment.
   */
  updateCommitment(addMinutes) {
    if (!this.commitment || !this.profile || addMinutes < 1) {
      return;
    }

    this.commitmentProgressDaily += addMinutes;

    const keysDaily = Object.keys(this.profile.meditations.lastDays);
    this.profile.meditations.lastDays[keysDaily[keysDaily.length - 1]] += addMinutes;

    this.commitmentProgress = this.commitmentService
                                  .reached(this.profile.meditations, this.commitment);
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

    // get user profile data (for preferred sound and last meditation time)
    const profile$ = this.userService.getProfile(this.getUserId())
      .map(res => res.json());

    // get commitment status for user
    const commitment$ =  this.commitmentService.getCurrentUser()
      .map(res => res.json());

    // forkJoin them since commitment calculation depends on the profile
    Observable.forkJoin([profile$, commitment$]).subscribe(res => {
      this.profile = res[0];
      this.profile.lastLike = this.profile.lastLike ? moment(this.profile.lastLike) : null;

      this.commitment = res[1];
      this.commitmentProgress = this.commitmentService
                                    .reached(this.profile.meditations, this.commitment);

      const keysDaily = Object.keys(this.profile.meditations.lastDays);
      this.commitmentProgressDaily =
                          this.profile.meditations.lastDays[keysDaily[keysDaily.length - 1]];
    }, err => console.log(err));
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

    if (this.bellInterval) {
      this.bellInterval.clear();
    }
  }
}
