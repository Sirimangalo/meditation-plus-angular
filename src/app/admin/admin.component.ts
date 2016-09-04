import { Component, ViewEncapsulation } from '@angular/core';
import { AppState } from '../app.service';

@Component({
  selector: 'admin',
  encapsulation: ViewEncapsulation.None,
  template: `<router-outlet></router-outlet>`,
  styles: [
    require('./admin.component.css')
  ]
})
export class AdminComponent {
  constructor(public appState: AppState) {
    this.appState.set('title', 'Administration');
  }
}
