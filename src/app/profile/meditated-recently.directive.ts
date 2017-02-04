import { Directive, HostBinding, Input, OnChanges } from '@angular/core';
import * as moment from 'moment';

@Directive({
  selector: '[meditated-recently]'
})
export class MeditatedRecentlyDirective implements OnChanges {

  _meditatedRecently = false;

  @Input() user;

  @HostBinding('class.meditated-recently')
  get meditatedRecently() { return this._meditatedRecently; }

  ngOnChanges() {
    if (!this.user || !this.user.lastMeditation) {
      return;
    }

    const diff = moment().diff(moment(this.user.lastMeditation));
    const duration = moment.duration(diff).asHours();
    this._meditatedRecently = duration < 3;
  }
}
