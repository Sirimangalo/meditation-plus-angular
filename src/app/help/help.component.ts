import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { AppState } from '../';

@Component({
  selector: 'help',
  template: require('./help.html'),
  styles: [
    require('./help.css')
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
