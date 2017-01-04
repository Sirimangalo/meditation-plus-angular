import { Component } from '@angular/core';
import { AppState } from '../app.service';
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
  searching: boolean = false;
  currentSearch: string = '';
  form: FormGroup;
  search: FormControl = new FormControl('');
  searchResults: Object[];

  // visitor's role
  // user: boolean = false;
  admin: boolean = false;

  // data from server
  data: Object[];
  categories: string[];
  videos: Object[];
  count: number = 0;

  // current selection
  tags: string[];
  selectedCategory: string;
  selectedTags: Object;
  selectedVideos: Object[];

  // UI & feedback models
  showCategory: boolean = true;
  showTags: boolean = false;
  showVideos: boolean = false;

  loadingCategories: boolean = false;
  loadingTags: boolean = false;
  loadingVideos: boolean = false;
  loadingSearch: boolean = false;

  constructor(
    public wikiService: WikiService,
    public fb: FormBuilder,
    public appState: AppState
  ) {
    this.appState.set('title', 'SI Video Wiki');
    this.form = fb.group({
      'search': this.search
    });
    this.search.valueChanges
      .debounceTime(400)
      .subscribe(val => {
        this.currentSearch = val;
        this.searching = this.currentSearch && this.currentSearch.length > 0 ? true : false;

        if (this.searching) {
          this.searchVideos(this.currentSearch);
        }
      });
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
  changeCategory(category: string) {
    if (!(category in this.data)) {
      return;
    }

    // change category
    this.selectedCategory = category;

    // update list of all tags
    this.tags = this.data[category]['tags'];

    // update list of current tags
    this.selectedTags = {};

    // initialize all tags as selected
    this.tags.map(tag => this.selectedTags[tag] = true);

    // change view
    this.showCategory = false;
    this.showTags = true;
    this.showVideos = true;

    this.loadVideos();
  }

  /**
   * Event after a video gets deleted
   */
  update() {
    // if there's only one video left reload everything
    if (this.selectedCategory && this.data
      && this.data[this.selectedCategory]['videos'].length <= 1) {
      this.reset();
    } else {
      this.loadVideos();
    }
  }

  /**
   * Load structure of video wiki (categories & tags)
   */
  loadStructure() {
    this.wikiService.getStructure()
      .map(res => res.json())
      .subscribe(
        data => {
          this.data = data;
          this.categories = Object.keys(data);

          // calculate count of all videos
          this.count = 0;
          for (let cat of data) {
            this.count += cat.count;
          }

          // update tags of category if selected
          if (this.selectedCategory) {
            this.tags = data[this.selectedCategory]['tags'];
          }

          this.loadingCategories = false;
        },
        () => this.loadingCategories = false
      );
  }

  /**
   * Load all videos for currently selected category
   */
  loadVideos() {
    if (!this.selectedCategory) {
      return;
    }

    this.loadingVideos = true;
    this.wikiService.getCategory(this.selectedCategory)
      .map(res => res.json())
      .subscribe(
        data => {
          this.videos = data;
          this.selectVideos();
          this.loadingVideos = false;
        },
        () => this.reset()
      );
  }

  /**
   * Reset current state & reload data
   */
  reset() {
    this.selectedCategory = '';
    this.selectedVideos = [];
    this.selectedTags = {};
    this.currentSearch = '';
    this.searchResults = [];

    this.videos = [];

    this.showCategory = true;
    this.showTags = false;
    this.showVideos = false;

    this.loadStructure();
  }

  /**
   * Toggle active state of tag
   * @param {string} tag tag name
   */
  toggleTag(tag: string) {
    if (!(tag in this.selectedTags)) {
      return;
    }

    this.selectedTags[tag] = !this.selectedTags[tag];

    // update video list
    this.selectVideos();
  }

  /**
   * Set active state of all tags at once
   * @param {boolean = false} state true means on, false means off
   */
  toggleAllTags(state: boolean = false) {
    for (let tag in this.selectedTags) {
      if (this.selectedTags.hasOwnProperty(tag)) {
        this.selectedTags[tag] = state;
      }
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
   * Submit a search query
   * @param {string} search search string
   */
  searchVideos(search: string) {
    if (!search) {
      return;
    }

    this.loadingSearch = true;
    this.wikiService.search(search)
      .map(res => res.json())
      .subscribe(
        data => {
          this.loadingSearch = false;
          this.searchResults = data;
        },
        () => this.loadingSearch = false
       );
  }

  /**
   * Stop ongoing search & reset to default view
   */
  resetSearch() {
    this.searching = false;
    this.currentSearch = '';
    this.searchResults = [];
  }

  ngOnInit() {
    this.loadingCategories = true;

    // check visitor's role
    // this.user = this.isUser();
    this.admin = this.isAdmin();

    this.loadStructure();
  }
}
