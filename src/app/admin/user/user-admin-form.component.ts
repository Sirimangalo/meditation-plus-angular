import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService, UserFormComponent } from '../../user';

@Component({
  selector: 'user-admin-form',
  template: require('./user-admin-form.html'),
  directives: [UserFormComponent],
  styles: [
    require('./user-admin-form.css')
  ]
})
export class UserAdminFormComponent {

  user: Object;
  loading: boolean = false;

  constructor(
    public userService: UserService,
    public route: ActivatedRoute,
    public router: Router
  ) {
    if (route.snapshot.params['id']) {
      this.userService
        .get(route.snapshot.params['id'])
        .map(res => res.json())
        .subscribe(res => this.user = res);
    }
  }

  submit() {
    this.loading = true;
    this.userService
      .save(this.user)
      .subscribe(
        res => this.router.navigate(['/admin/users']),
        err => {
          this.loading = false;
          console.log(err);
        },
        () => this.loading = false
      );
  }
}
