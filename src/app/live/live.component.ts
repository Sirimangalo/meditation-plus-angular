import { Component } from '@angular/core';
import { LiveService } from './live.service';
import { AppState } from '../app.service';
import * as moment from 'moment';

@Component({
  selector: 'live',
  template: require('./live.html'),
  styles: [
    require('./live.css')
  ]
})
export class LiveComponent {

  liveStream;

  constructor(
    public appState: AppState,
    public liveService: LiveService
  ) {
    appState.set('title', 'Live Stream');
    liveService.getLiveData()
      .map(res => res.json())
      .subscribe(res => this.liveStream = res);
  }

  get distance(): string {
    let streamTime = moment('1:00:00 +0000', 'HH:mm:ss Z');
    if (moment() > streamTime) {
      streamTime.add('day', 1);
    }
    return streamTime.fromNow();
  }
}
