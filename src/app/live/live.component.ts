import { Component } from '@angular/core';
import { LiveService } from './live.service';
import { AppState } from '../app.service';
import { Observable } from 'rxjs/Rx';
import * as moment from 'moment';

@Component({
  selector: 'live',
  template: require('./live.component.html'),
  styles: [
    require('./live.component.css')
  ]
})
export class LiveComponent {

  liveStream;
  intervalSubscription;

  constructor(
    public appState: AppState,
    public liveService: LiveService
  ) {
    appState.set('title', 'Live Stream');

    this.intervalSubscription = Observable.interval(10000)
      .switchMap(() => this.liveService.getLiveData())
      .map(res => res.json())
      .retry()
      .subscribe(res => this.liveStream = res);

    liveService.getLiveData()
      .map(res => res.json())
      .subscribe(res => this.liveStream = res);
  }

  get distance(): string {
    let streamTime = moment('1:00:00 +0000', 'HH:mm:ss Z');
    if (moment() > streamTime) {
      streamTime.add(1, 'day');
    }
    return streamTime.fromNow();
  }

  ngOnDestroy() {
    this.intervalSubscription.unsubscribe();
  }
}
