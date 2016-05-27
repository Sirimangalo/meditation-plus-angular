import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MeditationService } from '../meditation.service';
import { Response } from '@angular/http';
import { Router } from '@angular/router-deprecated';
import { Observable } from 'rxjs/Rx';
import * as moment from 'moment';

@Component({
  selector: 'meditation-list-entry',
  template: require('./list-entry.html'),
  styles: [
    require('./list-entry.css')
  ]
})
export class MeditationListEntryComponent {

  @Input() meditation: Object;
  @Output() liked: EventEmitter<any> = new EventEmitter<any>;

  constructor(public meditationService: MeditationService) {
  }

  /**
   * Returns the user id stored in localStorage
   */
  getUserId(): string {
    return window.localStorage.getItem('id');
  }

  like() {
    this.meditationService.like(this.meditation)
      .subscribe(() => {
        this.liked.next();
      }, (err) => {
        console.error(err);
      });
  }
}
