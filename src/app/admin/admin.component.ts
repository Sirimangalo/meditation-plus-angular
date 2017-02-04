import { Component, ViewEncapsulation } from '@angular/core';
import { AppState } from '../app.service';

@Component({
  selector: 'admin',
  encapsulation: ViewEncapsulation.None,
  template: `<router-outlet></router-outlet>`,
  styleUrls: [
    './admin.component.styl'
  ]
})
export class AdminComponent {
  constructor(public appState: AppState) {
    this.appState.set('title', 'Administration');
  }
}
