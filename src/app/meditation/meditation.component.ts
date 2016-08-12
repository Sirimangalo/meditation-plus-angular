import { Component } from '@angular/core';
import { MeditationService } from './meditation.service';
import { UserService } from '../user/user.service';
import { Response } from '@angular/http';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs/Rx';
import * as moment from 'moment';
import { CHART_DIRECTIVES } from 'ng2-charts/ng2-charts';
import { MeditationListEntryComponent } from './list-entry/list-entry.component';
import { AvatarDirective } from '../profile';

let chart = require('chart.js');

/**
 * Component for the meditation tab inside home.
 */
@Component({
  selector: 'meditation',
  template: require('./meditation.html'),
  directives: [CHART_DIRECTIVES, MeditationListEntryComponent, AvatarDirective],
  styles: [
    require('./meditation.css')
  ]
})
export class MeditationComponent {

  // user profile
  profile;

  // alarm bell
  bell;

  // meditation data
  activeMeditations: Object[];
  finishedMeditations: Object[];
  meditationSubscription;
  meditationSocket;
  ownSession = null;
  loadedInitially: boolean = false;

  // form data
  walking: string = '';
  sitting: string = '';

  // chart details
  chartSubscribtion: Subscription;
  chartLastHour: string = '';
  chartData: Array<any> = [];
  chartLabels: String[] = [];
  chartColors: Array<any> = [];
  chartOptions = {
    animations: true,
    maintainAspectRatio: false,
    responsive: true,
    legend: false,
    scales: {
      yAxes: [{
        display: false
      }],
      xAxes: [{
        // needed to have both series (normal and current hour) in one place
        stacked: true
      }]
    }
  };

  // current User data
  currentMeditation: string = '';
  userWalking: boolean = false;
  userSitting: boolean = false;

  constructor(
    public meditationService: MeditationService,
    public userService: UserService,
    public router: Router
  ) {
    this.polluteWithLastSession();

    let data = {data: [], label: 'Meditation minutes'};
    let dataCurrentHour = {data: [], label: 'Meditation minutes (current hour)'};

    let colors = [];
    for (let i = 0; i < 24; i++) {
      this.chartLabels.push('' + i);
    }
    this.chartData.push(data);

    // check for hour change every second
    this.chartSubscribtion = Observable.interval(1000)
      .subscribe(() => {
        const currentHour = moment().utc().format('H').toString();

        if (currentHour === this.chartLastHour) {
          return;
        }

        // create chart data on hour change
        meditationService
          .getTimes()
          .map(res => res.json())
          .subscribe(res => {
            this.chartLastHour = currentHour;

            // Two datasets are needed to have different colors for the bars.
            // The current hour should have other color.
            data = {data: [], label: 'Meditation minutes'};
            dataCurrentHour = {data: [], label: 'Meditation minutes (current hour)'};

            // normal color
            colors.push({
              backgroundColor: 'rgba(255, 33, 81, 0.4)'
            });

            // current hour
            colors.push({
              backgroundColor: 'rgba(255, 33, 81, 0.9)'
            });

            for (let entry of Object.keys(res)) {
              // push current hour times only to currentHour chart series
              if (entry === currentHour) {
                dataCurrentHour.data.push(res[entry]);
                data.data.push(0);
                continue;
              }
              data.data.push(res[entry]);
              dataCurrentHour.data.push(0);
            }
            this.chartData = [data, dataCurrentHour];
            this.chartColors = colors;
          });
      });
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
    return Observable.interval(60000)
      .switchMap(() => this.meditationService.getRecent())
      .map(res => (<any>res).json());
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

      this.activeMeditations = res.filter(data => {
        // also checking here if walking or sitting finished for the current user
        // to play a sound. Doing it inside the filter to reduce iterations.
        if (data._id === this.currentMeditation && this.userWalking && !data.walkingLeft){
          this.userWalking = false;
          this.playSound();
          console.log('Walking over');
        } else if (data._id === this.currentMeditation && this.userSitting && !data.sittingLeft) {
          this.userSitting = false;
          this.playSound();
          console.log('Sitting over');
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

    this.meditationService.post(walking, sitting)
      .map(res => res.json())
      .subscribe(res => {
        this.currentMeditation = res._id;
        this.loadMeditations();
      }, (err) => {
        console.error(err);
      });

    // Set user status
    this.userWalking = walking > 0;
    this.userSitting = sitting > 0;

    // Activate bell for mobile users
    this.bell.currentTime = 0;
    this.bell.play();
    this.bell.pause();
  }

  /**
   * Method for liking meditation sessions of other users.
   * @param {object} meditation Meditation session to add like to
   */
  like(meditation) {
    this.meditationService.like(meditation)
      .subscribe(() => {
        this.loadMeditations();
      }, (err) => {
        console.error(err);
      });
  }

  /**
   * Play sound. Needed for bells.
   */
  playSound() {
    if (this.bell){
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

    this.meditationService.stop()
      .subscribe(() => {
        this.userWalking = false;
        this.userSitting = false;
        this.loadMeditations();
      }, err => {
        console.error(err);
      });
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
          console.log(data); 
          this.profile = data;
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
    this.chartSubscribtion.unsubscribe();
  }
}
