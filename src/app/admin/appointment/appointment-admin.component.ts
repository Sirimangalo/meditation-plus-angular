import { Component } from '@angular/core';
import { AppointmentService } from '../../appointment';
import * as moment from 'moment-timezone';

@Component({
  selector: 'appointment-admin',
  templateUrl: './appointment-admin.html',
  styleUrls: [
    './appointment-admin.styl'
  ]
})
export class AppointmentAdminComponent {

  // appointment data
  appointments: Object[] = [];
  increment: number;

  // EDT or EST
  zoneName: string = moment.tz('America/Toronto').zoneName();

  constructor(public appointmentService: AppointmentService) {
    this.loadAppointments();
    this.loadIncrement();
  }

  /**
   * Loads all appointments
   */
  loadAppointments() {
    this.appointmentService
      .getAll()
      .map(res => res.json())
      .map(res => res.appointments)
      .subscribe(res => this.appointments = res);
  }

  printWeekDay(weekDay: number): string {
    return moment('' + weekDay, 'e').format('ddd');
  }

  /**
   * Converts hour from number to string.
   * @param  {number} hour EST/EDT hour from DB
   * @return {string}      Local hour in format 'HH:mm'
   */
  printHour(hour: number): string {
    let hourNew = hour + this.increment * 100;
    hourNew = hourNew < 0 || hourNew >= 2400 ? 0 : hourNew;

    // automatically fills empty space with '0' (i.e. 40 => '0040')
    const hourFormat = Array(5 - hourNew.toString().length).join('0') + hourNew.toString();

    return moment(hourFormat, 'HHmm').format('HH:mm');
  }

  delete(evt, appointment) {
    evt.preventDefault();

    if (!confirm('Are you sure?')) {
      return;
    }

    this.appointmentService
      .delete(appointment)
      .subscribe(() => this.loadAppointments());
  }

  loadIncrement() {
    this.appointmentService
      .getIncrement()
      .map(res => res.json())
      .subscribe(res => this.increment = res);
  }

  updateIncrement() {
    this.appointmentService
      .updateIncrement(this.increment)
      .subscribe(() => {
        // reload to check if request was successful
        this.loadIncrement();
      });
  }
}
