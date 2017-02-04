import { Component, OnDestroy } from '@angular/core';
import { LiveService } from './live.service';
import { AppState } from '../app.service';
import { Observable } from 'rxjs/Rx';
import * as moment from 'moment';

@Component({
  selector: 'live',
  templateUrl: './live.component.html',
  styleUrls: [
    './live.component.styl'
  ]
})
export class LiveComponent implements OnDestroy {

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
    const streamTime = moment('1:00:00 +0000', 'HH:mm:ss Z');
    if (moment() > streamTime) {
      streamTime.add(1, 'day');
    }
    return streamTime.fromNow();
  }

  ngOnDestroy() {
    this.intervalSubscription.unsubscribe();
  }
}
