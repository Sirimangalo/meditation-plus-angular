import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { UserService } from '../../user';
import * as moment from 'moment';

@Component({
  selector: 'user-admin',
  template: require('./user-admin.html'),
  styles: [
    require('./user-admin.css')
  ]
})
export class UserAdminComponent {

  users: Object[] = [];
  currentSearch: string = '';
  form: FormGroup;
  search: FormControl = new FormControl('');
  loading: boolean = false;
  searched: boolean = false;

  constructor(
    public userService: UserService,
    public fb: FormBuilder
  ) {
    this.form = fb.group({
      'search': this.search
    });
    this.search.valueChanges
      .debounceTime(400)
      .map(val => val.trim())
      .subscribe(val => {
        this.currentSearch = val;
        if (this.currentSearch) {
          this.loadUsers();
        }
      });
  }

  /**
   * Loads all users
   */
  loadUsers() {
    this.loading = true;
    this.userService
      .search(this.currentSearch)
      .map(res => res.json())
      .subscribe(res => {
        this.users = res;
        this.loading = false;
        this.searched = true;
      });
  }

  delete(evt, user) {
    evt.preventDefault();

    if (!confirm('Are you sure?')) {
      return;
    }

    this.userService
      .delete(user)
      .subscribe(() => this.loadUsers());
  }
}
