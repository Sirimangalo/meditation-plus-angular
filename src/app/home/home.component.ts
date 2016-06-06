import { Component } from '@angular/core';
import { CanActivate } from '@angular/router-deprecated';
import { loggedIn } from '../../logged-in.ts';
import { MessageComponent } from '../message';
import { MeditationComponent } from '../meditation';
import { CommitmentComponent } from '../commitment';

@Component({
  selector: 'home',
  template: require('./home.html'),
  directives: [ MessageComponent, MeditationComponent, CommitmentComponent ]
})
@CanActivate((next, prev) => {
  return loggedIn(next, prev)
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
