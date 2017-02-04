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
const StableInterval = require('stable-interval');

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

  // timer & alarm bell
  bell = null;
  timer = null;
  timerActive = false;

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
         && !this.timerActive) {
        this.startTimer(this.ownSession.walkingLeft, this.ownSession.sittingLeft);
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

    // set up timer & bell,
    // prevent 'gesture-requirement-for-media-playback' on mobile browsers
    this.bell = new Audio();
    this.bell.src = 'assets/audio/halfsec.mp3';
    this.bell.play();

    this.startTimer(walking, sitting);
  }

  /**
   * Method for starting a meditation timer.
   */
  startTimer(walking, sitting) {
    if (!this.profile) {
      return;
    }

    // play a static file as bell if supported
    if (this.profile.staticBell !== false
      && this.checkStaticBell(walking, sitting) && this.checkOGG()) {
      this.timerActive = true;

      const bellName = this.profile.sound.replace(/\/assets\/audio\/|.mp3/g, '');
      let url = 'https://share.sirimangalo.org/static/sounds/' + bellName + '/';

      if (!walking || !sitting) {
        url += (walking ? walking : sitting) + '.ogg';
      } else {
        url += walking + '_' + sitting + '.ogg';
      }

      this.playBell(url);
      return;
    }

    // start default script timer else
    if (this.profile.sound && this.checkMP3()) {
      this.timerActive = true;

      const timerStart = moment();

      let walkingDone = walking ? false : true;
      let sittingDone = sitting ? false : true;

      const interval = new StableInterval();
      interval.set(() => {
        if (!this.timerActive) {
          interval.clear();
        }

        const diff = moment().diff(timerStart, 'minutes');

        if (!walkingDone && diff >= walking) {
          this.playBell(this.profile.sound);
          walkingDone = true;
        }

        if (!sittingDone && diff >= walking + sitting) {
          this.playBell(this.profile.sound);
          sittingDone = true;
        }

        if (walkingDone && sittingDone) {
          this.timerActive = false;
          interval.clear();
        }
      }, 60000);
    }
  }

  /**
   * Stopping active timer.
   */
  stopTimer() {
    if (this.bell) {
      this.bell.pause();
      this.bell.currentTime = 0;
    }

    this.timerActive = false;
  }

  /**
   * Methods for checking audio support of browser.
   * source: http://diveintohtml5.info/everything.html
   */
  checkOGG() {
    const a = document.createElement('audio');
    return !!(a.canPlayType && a.canPlayType('audio/ogg; codecs="vorbis"').replace(/no/, ''));
  }
  checkMP3() {
    const a = document.createElement('audio');
    return !!(a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, ''));
  }

  /**
   * Checking if static file for bell probably exists.
   */
  checkStaticBell(walking, sitting) {
    if ((walking + sitting) % 5 !== 0) {
      return false;
    }

    if (walking === sitting) {
      return true;
    }

    if (!walking || !sitting) {
      return true;
    }

    return false;
  }

  /**
   * Playing meditation bell.
   */
  playBell(source = null) {
    if (!this.bell) {
      return;
    }

    if (source) {
      this.bell.src = source;
    }

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

    this.stopTimer();
    this.appState.set('isMeditating', false);
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
  }
}
