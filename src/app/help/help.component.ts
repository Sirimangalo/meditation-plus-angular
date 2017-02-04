import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { AppState } from '../app.service';

@Component({
  selector: 'help',
  templateUrl: './help.component.html',
  styleUrls: [
    './help.component.styl',
    '../profile/badge/badge.component.styl'
  ]
})
export class HelpComponent {

  version = 'dev';

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
