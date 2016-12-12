import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
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

  // searching for videos within selected category
  currentSearch: string = '';
  form: FormGroup;
  search: FormControl = new FormControl('');

  constructor(
    public wikiService: WikiService,
    public fb: FormBuilder
  ) {
    this.form = fb.group({
      'search': this.search
    });
    this.search.valueChanges
      .debounceTime(400)
      .subscribe(val => {
        console.log(val);
        if (val.length > 0) {
          this.wikiService.search(val)
            .map(res => res.json())
            .subscribe(
              data => this.currentVideos = data,
              () => this.currentVideos = this.selectedVideos
             );
        } else {
          this.currentVideos = this.selectedVideos;
        }

        this.currentSearch = val;
      });
  }

  loading: boolean = false;

  user: boolean = true;
  admin: boolean = false;

  // variables holding data from database
  structure: Object;
  categories: string[];
  videos: Object[];

  // variables holding current selection
  selectedCategory: string;
  selectedTags: Object;
  selectedVideo: string;
  selectedVideos: Object[];

  // contains either 'selectedVideos' or search results
  currentVideos: Object[];

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
    // don't allow unnecessary requests
    // or invalid names
    if (this.selectedCategory === name || !this.structure[name]) {
      // reset category if same was clicked again
      this.selectedCategory = '';
      return;
    }

    // clear search
    this.currentSearch = '';

    // change category
    this.selectedCategory = name;

    // update list of tags for new category
    this.selectedTags = {};

    for (let tag of this.structure[name].tags) {
      this.selectedTags[tag] = true;
    }

    // query videos for new category
    this.loadVideos();
  }

  resetSelection() {
    this.selectedCategory = '';
    this.selectedTags = {};
    this.selectedVideos = [];
  }

  loadVideos() {
    this.wikiService.query(this.selectedCategory)
      .map(res => res.json())
      .subscribe(data => this.videos = this.selectedVideos = this.currentVideos = data);
  }


  searchVideos(search: string = '') {
    this.wikiService.search(search)
      .map(res => res.json())
      .subscribe(data => this.currentVideos = data);
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

    this.currentVideos = this.selectedVideos;
  }

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

  /**
   * Generate an embed youtube video link
   * and assign it to the 'selectedVideo' model
   * @param {Object} video video object
   */
  selectVideo(video) {
    if (!video || !video.videoID) {
      return;
    }

    this.selectedVideo = 'https://www.youtube.com/embed/' + video.videoID + '?autoplay=1';
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
