import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { AppState } from '../app.service';

@Component({
  selector: 'help',
  template: require('./help.component.html'),
  styles: [
    require('./help.component.css'),
    require('../profile/badge/badge.component.css')
  ]
})
export class HelpComponent {

  version: string = 'dev';

  currentSection: string;

  constructor(
    public appState: AppState,
    public http: Http
  ) {
    appState.set('title', 'Help');
    http.get('/assets/version.json')
      .map(res => res.json())
      .subscribe(res => {
        this.version = res.version;
      });
  }

  showSection(whichSection) {
    this.currentSection = whichSection === this.currentSection ? '' : whichSection;
  }
}
