import { Component } from '@angular/core';
import { MessageComponent } from '../message';
import { MeditationComponent } from '../meditation';
import { CommitmentComponent } from '../commitment';

@Component({
  selector: 'home',
  template: require('./home.html'),
  directives: [ MessageComponent, MeditationComponent, CommitmentComponent ]
})
export class Home {
  currentTab: string = 'meditation';

  getButtonColor(tab: string) {
    return this.currentTab === tab ? 'primary' : '';
  }

  tab(tab: string) {
    this.currentTab = tab;
  }
}
