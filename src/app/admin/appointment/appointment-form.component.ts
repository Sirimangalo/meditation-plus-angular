import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentService } from '../../appointment';

@Component({
  selector: 'appointment-form',
  templateUrl: './appointment-form.component.html'
})
export class AppointmentFormComponent {

  appointment;
  loading = false;

  constructor(
    public appointmentService: AppointmentService,
    public route: ActivatedRoute,
    public router: Router
  ) {
    this.appointment = {};

    if (route.snapshot.params['id']) {
      this.appointmentService
        .get(route.snapshot.params['id'])
        .map(res => res.json())
        .subscribe(res => this.appointment = res);
    }
  }

  submit() {
    this.loading = true;
    this.appointmentService
      .save(this.appointment)
      .subscribe(
        res => this.router.navigate(['/admin/appointments']),
        err => {
          this.loading = false;
          console.log(err);
        },
        () => this.loading = false
      );
  }
}
