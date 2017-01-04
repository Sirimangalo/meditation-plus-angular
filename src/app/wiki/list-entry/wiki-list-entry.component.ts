import {
  Component,
  Pipe,
  Input,
  ViewChild,
  Output,
  EventEmitter
} from '@angular/core';
import { WikiService } from '../wiki.service';
import { Router } from '@angular/router';

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

  constructor(
    public wikiService: WikiService,
    public router: Router
  ) {

  }

  /**
   * Open the embed player with this video
   */
  playVideo() {
    if (!this.video || !this.video['videoID']) {
      return;
    }

    this.playerURL = 'https://www.youtube.com/embed/' + this.video['videoID'] + '?autoplay=1';
  }

  /**
   * Close embed player
   */
  closePlayer() {
    this.playerURL = '';
  }

  /**
   * Modify video
   * @param {video} video this video object
   */
  modify(video) {
    this.router.navigate(['/wiki/new', { modify: video.videoID }]);
  }

  /**
   * Delete video
   */
  delete() {
    if (!confirm('Are you sure?')) {
      return;
    }

    this.loading = true;
    this.wikiService.delete(this.video['videoID'])
      .subscribe(
          () => {
            this.loading = false;
            this.update.emit();
          },
          () => this.loading = false
      );
  }
}
