import { Component, ViewChild } from '@angular/core';
import { MessageComponent } from '../message';
import { MeditationComponent } from '../meditation';
import { CommitmentComponent } from '../commitment';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user';
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
  noTabs: boolean = false;

  constructor(
    public appState: AppState,
    public userService: UserService,
    public route: ActivatedRoute
  ) {
    this.appState.set('title', '');
    this.route.params
      .filter(res => res.hasOwnProperty('tab'))
      .subscribe(res => this.tab((<any>res).tab));

    // Get user profile data (for layout)
    this.userService.getProfile()
      .map(res => res.json())
      .subscribe(
        data =>  this.noTabs = data.noTabs,
        err => console.error(err)
      );
  }

  getButtonColor(tab: string) {
    return this.currentTab === tab ? 'primary' : '';
  }

  isCurrentTab(tab: string): boolean {
    return this.currentTab === tab;
  }

  tab(tab: string) {
    this.currentTab = tab;

    if (tab === 'meditation' && typeof this.medComponent !== 'undefined') {
      this.medComponent.onActivated();
    }

    if (this.activated.indexOf(tab) < 0) {
      this.activated.push(tab);
    }
  }
}
