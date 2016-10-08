import { Component } from '@angular/core';
import { MeditationService } from '../meditation.service';
import { UserService } from '../../user/user.service';
import { Response } from '@angular/http';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs/Rx';
import * as moment from 'moment';

let chart = require('chart.js');

/**
 * Component for the meditation tab inside home.
 */
@Component({
  selector: 'meditation-chart',
  template: require('./meditation-chart.html'),
  styles: [
    require('./meditation-chart.css')
  ]
})
export class MeditationChartComponent {

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
    },
    tooltips: {
      callbacks: {
        label: this.formatTooltipLabel,
        title: this.formatTooltipTitle
      }
    }
  };
  loading: boolean = false;

  constructor(
    public meditationService: MeditationService,
    public userService: UserService,
    public router: Router
  ) {
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
        const currentHour = moment().format('H').toString();

        if (this.loading || currentHour === this.chartLastHour) {
          return;
        }

        // create chart data on hour change
        this.loading = true;
        meditationService
          .getTimes()
          .map(res => res.json())
          .subscribe(res => {
            this.loading = false;
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
          }, () => this.loading = false);
      },
      err => {
        if (err.status === 401) {
          this.userService.logout();
          this.router.navigate(['/']);
        }
      });
  }

  formatTooltipTitle(tooltipItem) {
    const value: string = tooltipItem[0].xLabel;
    return value.length === 2 ? `${value}00h` : `0${value}00h`;
  }

  formatTooltipLabel(tooltipItem) {
    const value: number = tooltipItem.yLabel;
    if (!value) {
      return;
    }

    let duration = moment.duration(value, 'minutes');
    let hours = duration.asHours();

    return hours >= 24 ? Math.floor(hours) + ' hours' : duration.humanize();
  }


  ngOnDestroy() {
    this.chartSubscribtion.unsubscribe();
  }
}
