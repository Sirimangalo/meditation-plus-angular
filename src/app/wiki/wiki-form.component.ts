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


  structure: Object;
  categories: string[];

  // models
  selectedCategory: string;
  selectedTags: Object;

  // submit data
  form = { url: '', category: '', tags: '' };

  // user feedback
  loading: boolean = false;
  success: boolean = false;
  error: string;

  submit() {
    this.error = '';

    this.form.url = this.form.url.trim();
    this.form.category = this.form.category.trim();
    this.form.tags = this.form.tags.trim();

    if (!this.form.url || !this.form.category || !this.form.tags) {
      return;
    }

    // submit form data
    this.wikiService.post(this.form)
      .map(res => res.json())
      .subscribe(
        () => {},
        (err) => this.error = err.text()
      );
  }

  ngOnInit() {
    console.log('Hallo');

    this.wikiService.getStructure()
      .map(res => res.json())
      .subscribe(data => {
        this.structure = data;
        this.categories = Object.keys(data);
      });
  }
}
