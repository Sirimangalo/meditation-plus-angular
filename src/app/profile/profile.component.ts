import { Component, OnInit } from '@angular/core';
import { UserService } from '../user/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppState } from '../app.service';
import * as moment from 'moment';

interface MeditationStats {
  _id?: any;
  walking: string|number;
  sitting: string|number;
  total: string|number;
  countOfSessions?: number;
  avgSessionTime?: number;
}

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: [
    './profile.component.styl'
  ]
})
export class ProfileComponent implements OnInit {
  profile;

  profileStats: MeditationStats = null;
  chartData: {
    year: MeditationStats[],
    month: MeditationStats[],
    week: MeditationStats[]
  };
  consecutiveDays: {
    total: number,
    current: number
  };

  notFound = false;
  updated = false;

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

        // skip chart data if stats are hidden
        if (this.profile.hideStats && this.profile._id !== this.userId) {
          return;
        }

        this.loadStats(params);
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

  loadStats(params): void {
    this.userService.getProfileStats(params.id ? params.id : params.username)
      .map(res => res.json())
      .subscribe(res => {
        this.profileStats = res.general;
        this.chartData = res.chartData;
        this.consecutiveDays = res.consecutiveDays;

        // round average meditation time
        if (this.profileStats.avgSessionTime) {
          this.profileStats.avgSessionTime =
            Math.round(this.profileStats.avgSessionTime * 100) / 100;
        }

        // humanize durations of walking and sitting
        ['walking', 'sitting'].map(k => {
          this.profileStats[k] = this.profileStats[k] > 0
            ? moment.duration(this.profileStats[k], 'minutes').humanize()
            : 0;
        });
      });
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
