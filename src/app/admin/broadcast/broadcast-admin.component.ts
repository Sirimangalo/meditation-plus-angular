import { Component } from '@angular/core';
import { BroadcastService } from './broadcast.service';
import { SettingsService } from '../../shared/settings.service';
import * as moment from 'moment';

@Component({
  selector: 'broadcast-admin',
  templateUrl: './broadcast-admin.component.html',
  styleUrls: [
    './broadcast-admin.component.styl'
  ]
})
export class BroadcastAdminComponent {

  loadingSettings: boolean;
  loadingSubmit: boolean;
  settingsError: string;

  // broadcast data
  broadcasts: Object[] = [];
  activeBroadcast;

  livestreamInfo: string;

  constructor(
    public broadcastService: BroadcastService,
    public settingsService: SettingsService
  ) {
    this.loadingSettings = true;
    this.loadBroadcasts();
    this.loadSettings();
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

  /**
   * Loads settings entity (needed for livestream info text)
   */
  loadSettings() {
    this.settingsService.get()
      .map(res => res.json())
      .subscribe(settings => {
        this.loadingSettings = false;
        this.settingsError = '';
        this.livestreamInfo = settings.livestreamInfo
          ? settings.livestreamInfo
          : this.livestreamInfo;
      });
  }

  updateLivestreamInfo(evt = null) {
    this.loadingSubmit = true;

    if (evt) {
      evt.preventDefault();
    }

    this.settingsService.set('livestreamInfo', this.livestreamInfo)
      .subscribe(
        () => this.loadSettings(),
        err => this.settingsError = err.text(),
        () => this.loadingSubmit = false
      );
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
