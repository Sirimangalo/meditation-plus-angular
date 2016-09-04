import { Component } from '@angular/core';

@Component({
  selector: 'admin-index',
  template: require('./admin-index.component.html'),
})
export class AdminIndexComponent {
  constructor() {
    console.log('in adminindexcomponent');
  }
}
