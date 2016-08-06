import { Component } from '@angular/core';
import { MeditationService } from './meditation.service';
import { Response } from '@angular/http';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs/Rx';
import * as moment from 'moment';
import { CHART_DIRECTIVES } from 'ng2-charts/ng2-charts';
import { MeditationListEntryComponent } from './list-entry/list-entry.component';

let chart = require('chart.js');

@Component({
  selector: 'meditation',
  template: require('./meditation.html'),
  directives: [CHART_DIRECTIVES, MeditationListEntryComponent],
  styles: [
    require('./meditation.css')
  ]
})
export class MeditationComponent {

  // meditation data
  activeMeditations: Object[];
  finishedMeditations: Object[];
  meditationSubscription;
  meditationSocket;

  loadedInitially: boolean = false;

  // form data
  walking: string = '';
  sitting: string = '';

  // chart details
  chartData: Array<any> = [];
  chartLabels: String[] = [];
  chartOptions = {
    animations: true,
    maintainAspectRatio: false,
    responsive: true,
    legend: false,
    scales: {
      yAxes: [{
        display: false
      }]
    }
  };

  // sound list
  sounds: Object[] = [
    { name: 'Bell 1', src: '/assets/audio/bell'},
    { name: 'Bell 2', src: '/assets/audio/bell1'},
    { name: 'Birds', src: '/assets/audio/birds'},
    { name: 'Bowl', src: '/assets/audio/bowl'},
    { name: 'Gong', src: '/assets/audio/gong'},
  ];

  constructor(
    public meditationService: MeditationService,
    public router: Router
  ) {
    let data = {data: [], label: 'Meditation minutes'};
    for (let i = 0; i < 24; i++) {
      this.chartLabels.push('' + i);
    }
    this.chartData.push(data);

    // create chart data
    meditationService
      .getTimes()
      .map(res => res.json())
      .subscribe(res => {
        data = {data: [], label: 'Meditation minutes'};
        for (let entry of Object.keys(res)) {
          data.data.push(res[entry]);
        }
        this.chartData = [data];
      });
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
        return data.sittingLeft + data.walkingLeft > 0;
      });
      this.finishedMeditations = res.filter(data => {
        return data.sittingLeft + data.walkingLeft === 0;
      });
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

    // reset form
    this.sitting = '';
    this.walking = '';

    if (!walking && !sitting)
      return;

    this.meditationService.post(walking, sitting)
      .subscribe(() => {
        this.loadMeditations();
      }, (err) => {
        console.error(err);
      });
  }

  like(meditation) {
    this.meditationService.like(meditation)
      .subscribe(() => {
        this.loadMeditations();
      }, (err) => {
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
  }

  ngOnDestroy() {
    this.meditationSubscription.unsubscribe();
    this.meditationSocket.unsubscribe();
  }
}
