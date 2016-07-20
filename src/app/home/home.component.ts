import { Component } from '@angular/core';
import { MessageComponent } from '../message';
import { MeditationComponent } from '../meditation';
import { CommitmentComponent } from '../commitment';
import { AppState } from '../';

@Component({
  selector: 'home',
  template: require('./home.html'),
  directives: [ MessageComponent, MeditationComponent, CommitmentComponent ]
})
export class Home {
  currentTab: string = 'meditation';

  constructor(public appState: AppState) {
    this.appState.set('title', '');
  }

  getButtonColor(tab: string) {
    return this.currentTab === tab ? 'primary' : '';
  }

  tab(tab: string) {
    this.currentTab = tab;
  }
}
