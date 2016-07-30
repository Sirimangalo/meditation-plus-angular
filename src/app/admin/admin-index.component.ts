import { Component } from '@angular/core';

@Component({
  selector: 'admin-index',
  template: require('./admin.html'),
})
export class AdminIndexComponent {
  constructor() {
    console.log('in adminindexcomponent');
  }
}
