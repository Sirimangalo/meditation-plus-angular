import { Component } from '@angular/core';
import { CommitmentService } from '../../commitment';

@Component({
  selector: 'commitment-admin',
  template: require('./commitment-admin.html'),
  styles: [
    require('./commitment-admin.css')
  ]
})
export class CommitmentAdminComponent {

  // commitment data
  commitments: Object[] = [];

  constructor(public commitmentService: CommitmentService) {
    this.loadCommitments();
  }

  /**
   * Loads all commitments
   */
  loadCommitments() {
    this.commitmentService
      .getAll()
      .map(res => res.json())
      .subscribe(res => this.commitments = res);
  }

  delete(evt, commitment) {
    evt.preventDefault();

    if (!confirm('Are you sure?')) {
      return;
    }

    this.commitmentService
      .delete(commitment)
      .subscribe(() => this.loadCommitments());
  }
}
