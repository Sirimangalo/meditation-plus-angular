import {
  Component,
  Pipe,
  Input,
  ChangeDetectionStrategy,
  ViewChild,
  Output,
  EventEmitter
} from '@angular/core';
import { WikiService } from '../wiki.service';
import * as moment from 'moment';

@Component({
  selector: 'wiki-list-entry',
  template: require('./wiki-list-entry.component.html'),
  styles: [
    require('./wiki-list-entry.component.css')
  ]
})

export class WikiListEntryComponent {

  @Input() video: Object;
  @Input() admin: boolean = false;
  @Output() update: EventEmitter<any> = new EventEmitter<any>();

  playerURL: string;

  loading: boolean = false;

  constructor(public wikiService: WikiService) {}

  /**
   * Formats a duration using momentjs into the format '[H:mm:ss]' or '[mm:ss]'
   * @param {duration} duration time difference in a valid format for moment.duration
   */
  formatDuration(duration) {
    if (!duration) {
      return '';
    }

    const d = moment.duration(duration);
    const h = Math.floor(d.asHours());

    return '[' + (h > 0 ? h + ':' : '') + moment.utc(d.asMilliseconds()).format("mm:ss") + ']';
  }


  playVideo() {
    if (!this.video || !this.video['videoID']) {
      return;
    }

    this.playerURL = 'https://www.youtube.com/embed/' + this.video['videoID'] + '?autoplay=1';
  }

  closePlayer() {
    this.playerURL = '';
  }

  delete() {
    if (!confirm('Are you sure?')) {
      return;
    }

    this.loading = true;
    this.wikiService.delete(this.video['videoID'])
      .subscribe(
          () => this.loading = false,
          () => this.loading = false,
          () => this.update.emit()
      );
  }
}
