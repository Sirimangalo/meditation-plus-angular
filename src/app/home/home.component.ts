import { Component } from '@angular/core';
import { MessageComponent } from '../message';
import { MeditationComponent } from '../meditation';

@Component({
  selector: 'home',
  template: require('./home.html'),
  directives: [ MessageComponent, MeditationComponent ]
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
