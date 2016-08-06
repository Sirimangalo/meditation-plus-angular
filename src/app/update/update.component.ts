import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { AppState } from '../';

@Component({
  selector: 'update',
  template: require('./update.html'),
})
export class UpdateComponent {

  constructor(
    public appState: AppState
  ) {
    appState.set('title', 'Update');
  }
}
