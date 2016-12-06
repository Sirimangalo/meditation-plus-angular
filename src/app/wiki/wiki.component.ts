import { Component } from '@angular/core';

@Component({
  selector: 'wiki',
  template: require('./wiki.component.html'),
})
export class WikiComponent {

  category: string;

  tags;
  categories: string[];

  /**
   * Change the currently selected category.
   * @param {string} name name of the category
   */
  changeCategory(name: string) {
    this.category = name;
  }

  ngOnInit() {

  }
}
