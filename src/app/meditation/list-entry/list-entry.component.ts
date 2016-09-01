import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { MeditationService } from '../meditation.service';
import { Response } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { AvatarDirective } from '../../profile';
import { FlagComponent } from '../../profile/flag/flag.component';
import * as moment from 'moment';

@Component({
  selector: 'meditation-list-entry',
  template: require('./list-entry.html'),
  directives: [AvatarDirective, FlagComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    require('./list-entry.css')
  ]
})
export class MeditationListEntryComponent {
  @Input() meditation;
}
