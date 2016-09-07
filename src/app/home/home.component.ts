import { Component, ViewChild } from '@angular/core';
import { MeditationComponent } from '../meditation';
import { Router, ActivatedRoute } from '@angular/router';
import { AppState } from '../app.service';

@Component({
  selector: 'home',
  template: require('./home.component.html'),
  styles: [
    require('./home.component.css')
  ]
})
export class Home {
  @ViewChild(MeditationComponent) medComponent: MeditationComponent;

  currentTab: string = 'meditation';
  activated: string[] = ['meditation'];
  ownSession: boolean = false;

  constructor(
    public appState: AppState,
    public route: ActivatedRoute,
    public router: Router
  ) {
    this.appState.set('title', '');
    this.route.params
      .filter(res => res.hasOwnProperty('tab'))
      .subscribe(res => this.tab((<any>res).tab));

    // listen for meditation status
    appState
      .stateChange
      .filter(res => res.hasOwnProperty('isMeditating'))
      .subscribe(res => {
        this.ownSession = res.isMeditating || false;
      });
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

  openSidenav() {
    this.appState.set('openSidenav', true);
  }
}
