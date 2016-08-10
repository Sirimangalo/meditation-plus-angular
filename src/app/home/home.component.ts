import { Component, ViewChild } from '@angular/core';
import { MessageComponent } from '../message';
import { MeditationComponent } from '../meditation';
import { CommitmentComponent } from '../commitment';
import { AppState } from '../';

@Component({
  selector: 'home',
  template: require('./home.html'),
  styles: [
    require('./home.css')
  ],
  directives: [ MessageComponent, MeditationComponent, CommitmentComponent ]
})
export class Home {
  @ViewChild(MeditationComponent) medComponent: MeditationComponent;

  currentTab: string = 'meditation';
  activated: string[] = ['meditation'];


  constructor(public appState: AppState) {
    this.appState.set('title', '');
  }

  getButtonColor(tab: string) {
    return this.currentTab === tab ? 'primary' : '';
  }

  isCurrentTab(tab: string): boolean {
    return this.currentTab === tab;
  }

  tab(tab: string) {
    this.currentTab = tab;

    if (tab === 'meditation') {
      this.medComponent.onActivated();
    }

    if (this.activated.indexOf(tab) < 0) {
      this.activated.push(tab);
    }
  }
}
