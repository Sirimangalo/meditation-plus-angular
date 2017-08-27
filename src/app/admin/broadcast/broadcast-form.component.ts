import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BroadcastService } from './broadcast.service';

@Component({
  selector: 'broadcast-form',
  templateUrl: './broadcast-form.component.html'
})
export class BroadcastFormComponent {

  broadcast;
  loading: boolean;

  constructor(
    public broadcastService: BroadcastService,
    public route: ActivatedRoute,
    public router: Router
  ) {
    this.broadcast = {};

    if (route.snapshot.params['id']) {
      this.broadcastService
        .get(route.snapshot.params['id'])
        .map(res => res.json())
        .subscribe(res => this.broadcast = res);
    }
  }

  submit() {
    this.loading = true;
    this.broadcastService
      .save(this.broadcast)
      .subscribe(
        res => this.router.navigate(['/admin/broadcasts']),
        err => {
          this.loading = false;
          console.log(err);
        },
        () => this.loading = false
      );
  }
}
