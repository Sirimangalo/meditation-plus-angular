import { Component, OnDestroy } from '@angular/core';
import { LiveService } from './live.service';
import { SettingsService } from '../shared/settings.service';
import { AppState } from '../app.service';
import { Observable } from 'rxjs/Rx';

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

  loadingSettings: boolean;
  settings;

  constructor(
    public appState: AppState,
    public liveService: LiveService,
    public settingsService: SettingsService
  ) {
    appState.set('title', 'Live Stream');

    this.loadingSettings = true;
    this.settingsService.get()
      .map(res => res.json())
      .subscribe(res => {
        this.loadingSettings = false;
        this.settings = res;
      });

    this.intervalSubscription = Observable.interval(10000)
      .switchMap(() => this.liveService.getLiveData())
      .map(res => res.json())
      .retry()
      .subscribe(res => this.liveStream = res);

    liveService.getLiveData()
      .map(res => res.json())
      .subscribe(res => this.liveStream = res);
  }

  ngOnDestroy() {
    this.intervalSubscription.unsubscribe();
  }
}
