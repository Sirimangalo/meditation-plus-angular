import { Component } from '@angular/core';
import { AppointmentService } from './appointment.service';
import { Response } from '@angular/http';
import { Router } from '@angular/router-deprecated';
import { Observable, Subscription } from 'rxjs/Rx';
import { CHART_DIRECTIVES } from 'ng2-charts/ng2-charts';

@Component({
  selector: 'appointment',
  template: require('./appointment.html'),
  styles: [
    require('./appointment.css')
  ]
})
export class AppointmentComponent {

  appointments: Object[] = [];
  appointmentSocket;

  constructor(
    public appointmentService: AppointmentService,
    public router: Router
  ) {}

  /**
   * Returns the user id stored in localStorage
   */
  getUserId(): string {
    return window.localStorage.getItem('id');
  }

  /**
   * Method for querying appointments
   */
  loadAppointments(): void {
    this.appointmentService
      .getAll()
      .map(res => res.json())
      .subscribe(res => this.appointments = res);
  }

  /**
   * Registration handling
   */
  toggleRegistration(evt, appointment) {
    evt.preventDefault();

    // disallow registration for taken time slots
    if (appointment.user && appointment.user._id !== this.getUserId())
      return;

    this.appointmentService.registration(appointment)
      .subscribe(() => {
        this.loadAppointments();
      }, (err) => {
        console.error(err);
      });
  }

  ngOnInit() {
    this.loadAppointments();

    // initialize websocket for instant data
    this.appointmentSocket = this.appointmentService.getSocket()
      .subscribe(() => {
        this.loadAppointments();
      });
  }

  ngOnDestroy() {
    this.appointmentSocket.unsubscribe();
  }
}
