import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppointmentService } from '../../appointment';

@Component({
  selector: 'appointment-form',
  templateUrl: './appointment-form.component.html'
})
export class AppointmentFormComponent {

  appointment = {};
  loading = false;
  errorMsg = '';

  constructor(
    public appointmentService: AppointmentService,
    public router: Router
  ) {
  }

  submit() {
    this.loading = true;
    this.appointmentService
      .save(this.appointment)
      .subscribe(
        () => this.router.navigate(['/admin/appointments']),
        err => {
          this.errorMsg = err.text();
          this.loading = false;
        },
        () => this.loading = false
      );
  }
}
