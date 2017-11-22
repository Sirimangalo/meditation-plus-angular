import { Subscription } from 'rxjs/Subscription';
import { Component, OnDestroy } from '@angular/core';
import { MeditationService } from '../meditation.service';
import { UserService } from '../../user/user.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import 'chart.js';
import { Observable } from 'rxjs/Observable';

/**
 * Component for the meditation tab inside home.
 */
@Component({
  selector: 'meditation-chart',
  templateUrl: './meditation-chart.component.html',
  styleUrls: [
    './meditation-chart.component.styl'
  ]
})
export class MeditationChartComponent implements OnDestroy {

  // chart details
  chartSubscribtion: Subscription;
  chartLastHour = '';
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
  loading = false;

  constructor(
    public meditationService: MeditationService,
    public userService: UserService,
    public router: Router
  ) {
    let data = {data: [], label: 'Meditation minutes'};
    let dataCurrentHour = {data: [], label: 'Meditation minutes (current hour)'};

    const colors = [];
    for (let i = 0; i < 24; i++) {
      this.chartLabels.push('' + i);
    }
    this.chartData.push(data);

    // check for hour change every 5 seconds
    this.chartSubscribtion = Observable.interval(5000)
      .subscribe(() => {
        const currentHour = moment.utc().format('H').toString();

        if (this.loading || currentHour === this.chartLastHour) {
          return;
        }

        // create chart data on hour change
        this.loading = true;
        this.meditationService
          .getChartData()
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

            // fill all hours
            let values = res ? res : [];
            for (let i = 0; i < 24; i++) {
              let currentVal = 0;

              while (values.length > 0 && values[0]._id <= i) {
                // add value for current hour
                if (values[0]._id === i) {
                  currentVal = values[0].total;
                }

                values = values.slice(1);
              }

              if (i === parseInt(currentHour, 10)) {
                dataCurrentHour.data.push(currentVal);
                data.data.push(0);
              } else {
                data.data.push(currentVal);
                dataCurrentHour.data.push(0);
              }
            }

            // using push() twice seems to be necessary here
            // since the second dataset won't show otherwise
            this.chartData.push(data);
            this.chartData.push(dataCurrentHour);
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
    return value.length === 2 ? `${value}:00 UTC` : `0${value}:00 UTC`;
  }

  formatTooltipLabel(tooltipItem) {
    const value: number = tooltipItem.yLabel;
    if (!value) {
      return;
    }

    const duration = moment.duration(value, 'minutes');
    const hours = duration.asHours();

    return hours >= 24 ? Math.floor(hours) + ' hours' : duration.humanize();
  }


  ngOnDestroy() {
    this.chartSubscribtion.unsubscribe();
  }
}
