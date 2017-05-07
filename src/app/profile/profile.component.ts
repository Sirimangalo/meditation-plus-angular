import { Component, OnInit } from '@angular/core';
import { UserService } from '../user/user.service';
import { Observable } from 'rxjs/Rx';
import { ActivatedRoute, Router } from '@angular/router';
import { AppState } from '../app.service';
import { Country } from './country';
import * as moment from 'moment';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: [
    './profile.component.styl'
  ]
})
export class ProfileComponent implements OnInit {

  profile;
  notFound = false;
  updated = false;

  // chart details
  chartData: { lastMonths: Array<any>, lastWeeks: Array<any>, lastDays: Array<any> } = {
    lastMonths: [],
    lastWeeks: [],
    lastDays: []
  };
  chartLabels: { lastMonths: string[], lastWeeks: string[], lastDays: string[] } = {
    lastMonths: [],
    lastWeeks: [],
    lastDays: []
  };
  chartOptions = {
    animations: true,
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }],
    }
  };

  constructor(
    public userService: UserService,
    public route: ActivatedRoute,
    public appState: AppState,
    public router: Router
  ) {
    this.appState.set('title', 'Profile');
  }

  ngOnInit() {
    this.loadChart();
  }

  get isAdmin(): boolean {
    return this.userService.isAdmin();
  }

  loadChart() {
    this.route.params.subscribe(res => this.load(res));
  }

  load(params) {
    this.notFound = false;
    this.userService[params.id ? 'getProfile' : 'getProfileByUsername'](params.id ? params.id : params.username)
    .map(res => res.json())
    .subscribe(
      res => {
        this.profile = res;
        this.resetChart();

        // skip chart data if stats are hidden
        if (this.profile.hideStats && this.profile._id !== this.userId) {
          return;
        }

        // gather chart data
        for (const key of Object.keys(this.profile.meditations)) {
          if (!this.chartLabels.hasOwnProperty(key)) {
            continue;
          }
          const data = {data: [], label: 'Minutes meditated'};
          for (const value of Object.keys(this.profile.meditations[key])) {
            this.chartLabels[key].push(value);
            data.data.push(
              this.profile.meditations[key][value]
            );
          }
          this.chartData[key].push(data);
        }
      },
      err => {
        if (err.status === 404 || err.status === 400) {
          this.notFound = true;
          return;
        }
        console.error(err);
      }
    );
  }

  resetChart() {
    this.chartData = {
      lastMonths: [],
      lastWeeks: [],
      lastDays: []
    };
    this.chartLabels = {
      lastMonths: [],
      lastWeeks: [],
      lastDays: []
    };
  }

  escape(html: string): string {
    return (<any>document.createElement('a').appendChild(
      document.createTextNode(html)
    ).parentNode).innerHTML;
  }

  get userId() {
    return window.localStorage.getItem('id');
  }

  formatNoDays(time: number) {
    const duration = moment.duration(time, 'minutes');
    const hours = duration.asHours();
    return hours >= 24 ? Math.floor(hours) + ' hours' : duration.humanize();
  }

  delete() {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    this.userService
      .delete(this.profile)
      .subscribe(() => this.router.navigate(['/']));
  }

}
