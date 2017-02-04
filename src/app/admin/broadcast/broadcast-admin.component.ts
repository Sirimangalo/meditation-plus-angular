import { Component } from '@angular/core';
import { BroadcastService } from './broadcast.service';
import * as moment from 'moment';

@Component({
  selector: 'broadcast-admin',
  templateUrl: './broadcast-admin.html',
  styleUrls: [
    './broadcast-admin.styl'
  ]
})
export class BroadcastAdminComponent {

  // broadcast data
  broadcasts: Object[] = [];
  activeBroadcast;

  constructor(public broadcastService: BroadcastService) {
    this.loadBroadcasts();
  }

  /**
   * Loads all broadcasts
   */
  loadBroadcasts() {
    this.activeBroadcast = null;
    this.broadcastService
      .getAll()
      .map(res => res.json())
      .map(res => {
        res.map(bc => {
          if (bc.started && !bc.ended) {
            this.activeBroadcast = bc;
          }
          return bc;
        });
        return res;
      })
      .subscribe(res => this.broadcasts = res);
  }

  start() {
    this.broadcastService.save({
      started: new Date()
    })
    .subscribe(() => this.loadBroadcasts());
  }

  stop() {
    this.activeBroadcast.ended = new Date();
    this.broadcastService.save(this.activeBroadcast)
      .subscribe(() => this.loadBroadcasts());
  }

  delete(evt, broadcast) {
    evt.preventDefault();

    if (!confirm('Are you sure?')) {
      return;
    }

    this.broadcastService
      .delete(broadcast)
      .subscribe(() => this.loadBroadcasts());
  }
}
