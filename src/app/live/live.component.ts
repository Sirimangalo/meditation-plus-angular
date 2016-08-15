import { Component } from '@angular/core';
import { LiveService } from './live.service';
import { AppState } from '../';

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
}
