import { Component } from '@angular/core';
import { MeditationService } from './meditation.service';
import { Router } from '@angular/router-deprecated';
import { Observable } from 'rxjs/Rx';
import * as moment from 'moment';
import { CHART_DIRECTIVES } from 'ng2-charts/ng2-charts';

let Chart = require('chart.js');

@Component({
  selector: 'meditation',
  template: require('./meditation.html'),
  directives: [CHART_DIRECTIVES],
  styles: [
    require('./meditation.css')
  ]
})
export class MeditationComponent {

  meditations: Object[];
  meditationSubscription;
  walking: string = '';
  sitting: string = '';
  chartData: Array<any> = [];
  chartLabels: String[] = [];
  chartOptions = {
    animations: true,
    responsive: true
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
    let data = {data: [], label: 'Meditations'};
    for (let i = 0; i < 24; i++) {
      this.chartLabels.push('' + i);
      data.data.push(
        Math.floor(Math.random() * (70 - 0)) + 0
      );
    }
    this.chartData.push(data);

    console.log(this.chartLabels);
    console.log(this.chartData);
  }

  pollMeditations() {
    return Observable.interval(2000)
      .switchMap(() => this.meditationService.getRecent())
      .map(res => res.json());
  }

  loadMeditations() {
    this.meditationService.getRecent()
      .map(res => res.json())
      .subscribe(data => this.meditations = data);
  }

  sendMeditation(evt) {
    evt.preventDefault();
    let walking = this.walking ? parseInt(this.walking, 10) : 0;
    let sitting = this.sitting ? parseInt(this.sitting, 10) : 0;
    if (!walking && !sitting)
      return;

    this.meditationService.post(walking, sitting)
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
    this.meditationSubscription = this.pollMeditations()
      .subscribe(
        data => this.meditations = data,
        err => console.error(err)
      );
  }

  ngOnDestroy() {
    this.meditationSubscription.unsubscribe();
  }
}
