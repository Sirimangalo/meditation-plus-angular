import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { AppState } from '../app.service';

@Component({
  selector: 'update',
  templateUrl: './update.component.html',
})
export class UpdateComponent {

  constructor(
    public appState: AppState
  ) {
    appState.set('title', 'Update');
  }
}
