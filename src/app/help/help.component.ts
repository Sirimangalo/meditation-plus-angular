import { Component } from '@angular/core';
import { AppState } from '../';

@Component({
  selector: 'help',
  template: require('./help.html'),
  styles: [
    require('./help.css')
  ]
})
export class HelpComponent {
  constructor(public appState: AppState) {
    this.appState.set('title', 'Help');
  }
}
