import { Component } from '@angular/core';
import { AppointmentService } from '../../appointment';
import * as moment from 'moment';

@Component({
  selector: 'appointment-admin',
  template: require('./appointment-admin.html'),
  styles: [
    require('./appointment-admin.css')
  ]
})
export class AppointmentAdminComponent {

  // appointment data
  appointments: Object[] = [];

  constructor(public appointmentService: AppointmentService) {
    this.loadAppointments();
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

  printHour(hour: number): string {
    return moment('' + hour, hour < 1000 ? 'Hmm' : 'HHmm').format('HH:mm');
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
}
