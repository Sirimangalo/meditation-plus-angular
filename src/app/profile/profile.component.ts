import { Component } from '@angular/core';
import { UserService } from '../user/user.service';
import { CanActivate, Router, RouteParams } from '@angular/router-deprecated';
import { Observable } from 'rxjs/Rx';
import { loggedIn } from '../../logged-in.ts';
import { CHART_DIRECTIVES } from 'ng2-charts/ng2-charts';

@Component({
  selector: 'profile',
  template: require('./profile.html'),
  directives: [CHART_DIRECTIVES],
  styles: [
    require('./profile.css')
  ]
})
@CanActivate((next, prev) => {
  return loggedIn(next, prev)
})
export class ProfileComponent {

  profile: Object;
  notFound: boolean = false;

  // chart details
  chartData: Array<any> = [];
  chartLabels: String[] = [];
  chartOptions = {
    animations: true,
    maintainAspectRatio: false,
    responsive: true
  };

  constructor(
    public userService: UserService,
    public router: Router,
    public params: RouteParams
  ) {
  }

  ngOnInit() {
    this.userService.getProfile(this.params.get('username'))
      .map(res => res.json())
      .subscribe(
        data => {
          this.profile = data;

          // gather chart data
          let data = {data: [], label: 'Minutes meditated'};
          for (let key of Object.keys(this.profile.meditations)) {
            this.chartLabels.push(key);
            data.data.push(
              this.profile.meditations[key]
            );
          }
          this.chartData.push(data);
        },
        err => {
          if (err.status === 404) {
            this.notFound = true;
            return;
          }
          console.error(err)
        }
      );
  }
}
