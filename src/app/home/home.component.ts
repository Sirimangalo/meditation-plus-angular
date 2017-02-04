import { Component, ViewChild } from '@angular/core';
import { MeditationComponent } from '../meditation';
import { Router, ActivatedRoute } from '@angular/router';
import { AppState } from '../app.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: [
    './home.component.styl'
  ]
})
export class HomeComponent {
  @ViewChild(MeditationComponent) medComponent: MeditationComponent;

  currentTab = 'meditation';
  activated: string[] = ['meditation'];
  ownSession = false;

  constructor(
    public appState: AppState,
    public route: ActivatedRoute,
    public router: Router
  ) {
    this.appState.set('title', '');
    this.appState.set('openSidenav', false);
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
