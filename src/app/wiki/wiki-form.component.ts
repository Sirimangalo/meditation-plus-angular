import { Component } from '@angular/core';
import { WikiService } from './wiki.service';

@Component({
  selector: 'wiki-form',
  template: require('./wiki-form.component.html'),
  styles: [
    require('./wiki-form.component.css')
  ]
})
export class WikiFormComponent {

  constructor(
    public wikiService: WikiService
  ) {

  }

  // data from database
  structure: Object[];

  // form data
  url: string;

  // model for radio group
  category: string;

  // model for md-input within radio group
  customCategory: string = '';

  // model for checkboxes for already existing tags
  tags: string[] = [];

  // model for md-input for new tags
  customTags: string;

  // feedback features
  loading: boolean = false;
  success: boolean = false;
  error: string;

  resetCategory() {
    this.category = '';
  }

  resetForm() {
    this.url = '';
    this.category = '';
    this.tags = [];
    this.customTags = '';
    this.error = '';
    this.loading = false;
  }

  resetTags() {
    this.tags = [];
  }

  toggleTag(event, tag: string) {

    const index = this.tags.indexOf(tag);

    // check if checkbox was checked/unchecked
    // and add/remove the tag if it does not already exists/does exist
    // in 'selectedTags'
    if (event.checked && index === -1) {
      this.tags.push(tag);
    } else
    if (!event.checked && index > -1){
      this.tags.splice(index, 1);
    }
  }

  submit(evt = null) {
    if (evt) {
      evt.preventDefault();
    }

    // check if necessary data is present
    if (!this.url || !(this.category || this.customCategory) || !(this.tags || this.customTags)) {
      return false;
    }

    this.loading = true;

    const category = this.customCategory ? this.customCategory : this.category;

    // merge all tags
    let tags = this.customTags;

    // add selected tags if possible
    if (!this.customCategory && this.tags) {
      tags += ',' + this.tags.join(',');
    }

    // submit form data
    this.wikiService.post(this.url, category, tags)
      .subscribe(
        () => {
          console.log('Success');
          this.loading = false;
          this.success = true;
          this.resetForm();
          setTimeout(() => this.success = false, 1400);
        },
        (err) => {
          console.log(err);
          this.error = err.text();
          this.loading = false;
        }
      );
  }

  ngOnInit() {
    // get categories & tags for suggestions from server
    this.wikiService.getStructure()
      .map(res => res.json())
      .subscribe(data => this.structure = data);
  }
}
