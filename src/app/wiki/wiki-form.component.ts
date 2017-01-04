import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WikiService } from './wiki.service';

@Component({
  selector: 'wiki-form',
  template: require('./wiki-form.component.html'),
  styles: [
    require('./wiki-form.component.css')
  ]
})
export class WikiFormComponent {

  // subscription for router params
  routerParams;

  // data from database
  data: Object;
  categories: string[];


  // form data
  url: string;

  // model for radio group
  category: string;

  // model for md-input within radio group
  newCategory: string = '';

  // models for tags
  oldTags: string[];
  tags: string = '';

  // user feedback
  loading: boolean = false;
  loadingData: boolean = false;
  success: boolean = false;
  error: string;

  // whether a video gets modified or newly submitted
  modify: boolean = false;
  modTitle: string;

  constructor(
    public wikiService: WikiService,
    private route: ActivatedRoute,
    public router: Router
  ) {

  }

  /**
   * Reset all form data
   */
  resetForm() {
    this.data = {};
    this.categories = [];
    this.url = '';
    this.category = '';
    this.newCategory = '';
    this.oldTags = [];
    this.tags = '';
    this.error = '';
    this.loading = false;
  }

  /**
   * Submit the query to add/modify a video
   * @param {[type]} evt = null DOM event
   */
  submit(evt = null) {
    if (evt) {
      evt.preventDefault();
    }

    // check if necessary data is present
    if (!this.url || !(this.category || this.newCategory) || !this.tags) {
      return false;
    }

    this.loading = true;

    const category = this.newCategory ? this.newCategory : this.category;

    // submit form data
    this.wikiService.submit(this.url, category, this.tags)
      .subscribe(
        () => {
          this.loading = false;
          this.success = true;
          this.resetForm();
          this.loadStructure();
        },
        (err) => {
          console.log(err);
          this.error = err.text();
          this.loading = false;
        }
      );
  }

  /**
   * Add a tag to the current tags string
   * @param {string} tag tag string
   */
  addTag(tag: string) {
    const pattern = '(^|,)' + tag + '(,|$)';
    const regExp = new RegExp(pattern);

    if (!this.tags.match(regExp)) {
      this.tags += (this.tags.length ? ',' : '') + tag;
    }
  }

  /**
   * Load structure of video wiki (categories & tags)
   */
  loadStructure() {
    this.loadingData = true;

    // get categories & tags from server
    this.wikiService.getStructure()
      .map(res => res.json())
      .subscribe(
        data => {
          this.loadingData = false;
          this.data = data;
          this.categories = Object.keys(data);
        },
        () => this.loadingData = false
      );
  }

  ngOnInit() {
    this.loadingData = true;

    this.routerParams = this.route.params.subscribe(params => {
      if (params['modify']) {
        this.wikiService.getVideo(params['modify'])
          .map(res => res.json())
          .subscribe(
            data => {
              this.modify = true;
              this.modTitle = data['title'];
              this.url = 'https://youtu.be/' + params['modify'];
              this.category = data['category'];
              this.tags = data['tags'].join(',');
            },
            () => this.modify = false
          );
      }
    });

    this.loadStructure();
  }

  ngOnDestroy() {
    this.routerParams.unsubscribe();
  }
}
