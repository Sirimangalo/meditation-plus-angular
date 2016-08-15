import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { MeditationService } from '../meditation.service';
import { Response } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { AvatarDirective } from '../../profile';
import * as moment from 'moment';

@Component({
  selector: 'meditation-list-entry',
  template: require('./list-entry.html'),
  directives: [AvatarDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    require('./list-entry.css')
  ]
})
export class MeditationListEntryComponent {

  @Input() meditation;
  @Output() liked: EventEmitter<any> = new EventEmitter<any>();

  constructor(public meditationService: MeditationService) {
  }

  /**
   * Returns the user id stored in localStorage
   */
  getUserId(): string {
    return window.localStorage.getItem('id');
  }

  like() {
    this.meditation.sendingLike = true;
    this.meditationService.like(this.meditation)
      .subscribe(() => {
        this.meditation.sendingLike = false;
        this.liked.next(this.meditation);
        this.meditation.likes = 10;
        this.meditation.alreadyLiked = true;
      }, (err) => {
        this.meditation.sendingLike = false;
        console.error(err);
      });
  }
}
