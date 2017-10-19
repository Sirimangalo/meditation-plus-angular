import { Component } from '@angular/core';
import { AppState } from '../app.service';

@Component({
  selector: 'not-found',
  template: `
    <mat-card>
      <mat-card-title>Page has not been found</mat-card-title>
      <p>The page you are looking for does not exist.</p>
    </mat-card>
  `
})
export class NotFoundComponent {
  constructor(public appState: AppState) {
    appState.set('title', 'Not found');
  }
}
