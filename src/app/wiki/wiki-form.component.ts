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
  structure: Object;
  categories: string[];

  // contain selected options for
  // - category (=> radio buttons)
  // - tags (=> checkboxes)
  selectedCategory: string;
  selectedTags: string[] = [];

  // form models for text inputs
  form = { url: '', category: '', tags: '' };

  // feedback features
  loading: boolean = false;
  success: boolean = false;
  error: string;

  resetSelectedCategory() {
    this.selectedCategory = '';
  }

  resetForm() {
    this.form.url = '';
    this.form.category = '';
    this.form.tags = '';
  }

  resetTags() {
    this.selectedTags = [];
  }

  toggleTag(event, tag: string) {

    const index = this.selectedTags.indexOf(tag);

    // check if checkbox was checked/unchecked
    // and add/remove the tag if it does not already exists/does exist
    // in 'selectedTags'
    if (event.checked && index === -1) {
      this.selectedTags.push(tag);
    } else
    if (!event.checked && index > -1){
      this.selectedTags.splice(index, 1);
    }
  }

  submit(evt = null) {
    if (evt) {
      evt.preventDefault();
    }

    this.loading = true;

    // check if necessary data is present
    if (!this.form.url ||
       !(this.form.category && this.selectedCategory)
    || !(this.form.tags && this.selectedTags)) {
      return false;
    }

    // clone form model
    let formData = this.form;

    // get the category name either by text input or radio button selection
    formData.category = this.form.category ? this.form.category : this.selectedCategory;

    // Since the checkboxes ('selectedTags') for tags are hidden if the
    // category was typed in and not selected via radio-buttons ('selectedCategory')
    // we should make sure that selected tags from the checkboxes only are added to the form data
    // if the checkboxes are visible to the user (=> 'selectedCategory' && !form.category)
    //
    // ... and concat them with the tags typed in via text input ('form.tags')
    formData.tags = !this.form.category && this.selectedCategory && this.selectedTags.length > 0
            ? this.selectedTags.join(',') + ',' + this.form.tags
            : this.form.tags;

    // submit form data
    this.wikiService.post(formData)
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
      .subscribe(data => {
        this.structure = data;
        this.categories = Object.keys(data);
      });
  }
}
