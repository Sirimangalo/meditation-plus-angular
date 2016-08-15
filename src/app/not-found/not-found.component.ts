import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { AppState } from '../';

@Component({
  selector: 'not-found',
  template: `
    <md-card>
      <md-card-title>Page has not been found</md-card-title>
      <p>The page you are looking for does not exist.</p>
    </md-card>
  `
})
export class NotFoundComponent {
  constructor(public appState: AppState) {
    appState.set('title', 'Not found');
  }
}
