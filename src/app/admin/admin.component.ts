import { Component } from '@angular/core';
import { AppState } from '../';

@Component({
  selector: 'admin',
  template: require('./admin.html'),
  styles: [
    require('./admin.css')
  ]
})
export class AdminComponent {
  constructor(public appState: AppState) {
    this.appState.set('title', 'Administration');
  }
}
