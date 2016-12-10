import { Component } from '@angular/core';
import { WikiService } from './wiki.service';
import * as moment from 'moment';

@Component({
  selector: 'wiki',
  template: require('./wiki.component.html'),
  styles: [
    require('./wiki.component.css')
  ]
})
export class WikiComponent {

  constructor(
    public wikiService: WikiService
  ) {

  }

  loading: boolean = false;

  // type of visitor
  user: boolean = true;
  admin: boolean = false;

  // variables holding data from database
  structure: Object;
  categories: string[];
  videos: Object[];

  // currently selected category

  // object holding current selection of tags/videos
  selectedCategory: string;
  selectedTags: Object;
  selectedVideo: string;
  selectedVideos: Object[];

  /**
   * Check if visitor is a logged user
   * @return {boolean} true if visitor is user, false otherwise
   */
  isUser(): boolean {
    return window.localStorage.getItem('role')
      ? window.localStorage.getItem('role') === 'ROLE_USER'
      : false;
  }

  /**
   * Check if user is an admin
   * @return {boolean} true if user is an admin, false otherwise
   */
  isAdmin(): boolean {
    return window.localStorage.getItem('role')
      ? window.localStorage.getItem('role') === 'ROLE_ADMIN'
      : false;
  }

  /**
   * Change the currently selected category.
   * @param {string} name name of the category
   */
  changeCategory(name: string) {
    if (this.selectedCategory === name) {
      return;
    }

    // change category
    this.selectedCategory = name;

    // reset selection
    this.selectedTags = {};
    this.selectedVideos = [];

    // checkbox models
    for (let tag of this.structure[name].tags) {
      this.selectedTags[tag] = true;
    }

    // query videos for new category
    this.wikiService.query(this.selectedCategory)
      .map(res => res.json())
      .subscribe(data => this.videos = this.selectedVideos = data);
  }

  /**
   * Update list of selected/visible videos
   * Get all videos for current selection of category & tags
   */
  updateVideos() {
    this.selectedVideos = this.videos.filter(video => {
      // check if one of the video's tag is in the 'selectedTags' object
      for (let tag in this.selectedTags) {
        if (this.selectedTags[tag] && video['tags'].indexOf(tag) > -1) {
          return true;
        }
      }
      return false;
    });
  }

  /**
   * Formats a duration using momentjs into the format '[H:mm:ss]' or '[mm:ss]'
   * @param {duration} duration time difference in a valid format for moment.duration
   */
  formatDuration(duration) {
    console.log(duration);
    if (!duration) {
      return '';
    }

    const d = moment.duration(duration);
    const h = Math.floor(d.asHours());

    return '[' + (h > 0 ? h + ':' : '') + moment.utc(d.asMilliseconds()).format("mm:ss") + ']';
  }

  /**
   * Generate an embed youtube video link
   * and assign it to the 'selectedVideo' model
   * @param {Object} video video object
   */
  selectVideo(video) {
    if (!video || !video.url) {
      return;
    }

    const videoID = video.url.slice(-11);
    this.selectedVideo = 'https://www.youtube.com/embed/' + videoID + '?autoplay=1';
  }

  ngOnInit() {
    this.loading = true;

    // check visitor's role
    this.user = this.isUser();
    this.admin = this.isAdmin();

    this.wikiService.getStructure()
      .map(res => res.json())
      .subscribe(data => {
        this.categories = Object.keys(data);
        this.structure = data;
        this.loading = false;
      });
  }
}
