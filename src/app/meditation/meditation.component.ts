import { Component } from '@angular/core';
import { MeditationService } from './meditation.service';
import { Response } from '@angular/http';
import { Router } from '@angular/router-deprecated';
import { Observable, Subscription } from 'rxjs/Rx';
import * as moment from 'moment';
import { CHART_DIRECTIVES } from 'ng2-charts/ng2-charts';
import { MeditationListEntryComponent } from './list-entry/list-entry.component';

let Chart = require('chart.js');

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

  // form data
  walking: string = '';
  sitting: string = '';

  // chart details
  chartData: Array<any> = [];
  chartLabels: String[] = [];
  chartOptions = {
    animations: true,
    responsive: true,
    legend: false,
    scales: {
      yAxes: [{
        display: false
      }]
    }
  };

  constructor(
    public meditationService: MeditationService,
    public router: Router
  ) {
    // mock chart data
    let data = {data: [], label: 'Meditations'};
    for (let i = 0; i < 24; i++) {
      this.chartLabels.push('' + i);
      data.data.push(
        Math.floor(Math.random() * (70 - 0)) + 0
      );
    }
    this.chartData.push(data);
  }

  /**
   * Start polling observable
   */
  pollMeditations(): Observable<Response> {
    return Observable.interval(2000)
      .switchMap(() => this.meditationService.getRecent())
      .map(res => res.json());
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
      this.activeMeditations = res.filter(data => {
        return data.sittingLeft + data.walkingLeft > 0
      });
      this.finishedMeditations = res.filter(data => {
        return data.sittingLeft + data.walkingLeft === 0
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
  }

  ngOnDestroy() {
    this.meditationSubscription.unsubscribe();
  }
}
