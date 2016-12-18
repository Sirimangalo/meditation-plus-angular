import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { WikiService } from './wiki.service';


@Component({
  selector: 'wiki',
  template: require('./wiki.component.html'),
  styles: [
    require('./wiki.component.css')
  ]
})
export class WikiComponent {


  // search models
  currentSearch: string = '';
  form: FormGroup;
  search: FormControl = new FormControl('');
  searchResults: Object[];

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
        this.currentSearch = val;
        this.getSearchResults();
      });
  }

  // visitor's role
  user: boolean = false;
  admin: boolean = false;

  // data from server
  structure: Object[];
  categories: string[];
  videos: Object[];
  count: number = 0;

  // current selection
  selectedCategory: string;
  selectedTags: Object;
  selectedVideos: Object[];
  selectedVideo: string;

  // UI & feedback models
  showCategory: boolean = true;
  showTags: boolean = true;
  showVideos: boolean = true;

  loadingCategories: boolean = false;
  loadingTags: boolean = false;
  loadingVideos: boolean = false;
  loadingSearch: boolean = false;

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
   * @param {string} newCategory name of the category
   */
  changeCategory(newCategory: string) {
    if (this.selectedCategory === newCategory) {
      // reset category if same was clicked again
      this.selectedCategory = '';
      return;
    }

    // extract object of category
    let category = this.structure.filter(item => { return 'name' in item && item['name'] === newCategory})[0];

    if (!category) {
      return;
    }

    // change category
    this.selectedCategory = newCategory;

    // update list of current tags
    this.selectedTags = {};

    for (let tag of category['tags']) {
      this.selectedTags[tag] = true;
    }

    // hide category section
    this.showCategory = false;

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
      .subscribe(data => {
        this.videos = data;
        this.selectVideos();
      });
  }


  searchVideos(search: string = '') {
    this.wikiService.search(search)
      .map(res => res.json())
      .subscribe(data => this.searchResults = data);
  }

  toggleTag(event, tag: string) {
    if (!(tag in this.selectedTags)) {
      return;
    }

    this.selectedTags[tag] = !this.selectedTags[tag];

    // update video list
    this.selectVideos();
  }

  toggleAllTags(state: boolean = false) {
    for (let tag in this.selectedTags) {
      this.selectedTags[tag] = state;
    }

    // update video list
    this.selectVideos();
  }

  /**
   * Update list of selected/visible videos
   * Get all videos for current selection of category & tags
   */
  selectVideos() {
    if (!this.videos) {
      return;
    }

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

  getSearchResults() {
    if (!this.currentSearch || !this.currentSearch.length) {
      return;
    }

    this.loadingSearch = true;
    this.wikiService.search(this.currentSearch)
      .map(res => res.json())
      .subscribe(
        data => {
          this.loadingSearch = false;
          this.searchResults = data;
        },
        () => this.loadingSearch = false
       );
  }

  ngOnInit() {
    this.loadingCategories = true;

    // check visitor's role
    this.user = this.isUser();
    this.admin = this.isAdmin();

    this.wikiService.getStructure()
      .map(res => res.json())
      .subscribe(data => {
        this.structure = data;
        this.categories = [];

        this.count = 0;
        data.map(item => {
          this.categories.push(item.name);
          this.count += item.count
        });

        this.loadingCategories = false;
      });
  }
}
