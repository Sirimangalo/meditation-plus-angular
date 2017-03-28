import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommitmentService } from '../../commitment';

@Component({
  selector: 'commitment-form',
  templateUrl: './commitment-form.html',
  styleUrls: [
    './commitment-form.styl'
  ]
})
export class CommitmentFormComponent {

  commitment;
  loading = false;

  constructor(
    public commitmentService: CommitmentService,
    public route: ActivatedRoute,
    public router: Router
  ) {
    this.commitment = {};

    if (route.snapshot.params['id']) {
      this.commitmentService
        .get(route.snapshot.params['id'])
        .map(res => res.json())
        .subscribe(res => this.commitment = res);
    }
  }

  submit() {
    this.loading = true;
    this.commitmentService
      .save(this.commitment)
      .subscribe(
        res => this.router.navigate(['/admin/commitments']),
        err => {
          this.loading = false;
          console.log(err);
        },
        () => this.loading = false
      );
  }
}
