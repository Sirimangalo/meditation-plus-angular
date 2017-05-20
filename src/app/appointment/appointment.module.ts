import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared';
import { ProfileModule } from '../profile';
import { AppointmentComponent } from './appointment.component';

@NgModule({
  imports: [
    RouterModule,
    SharedModule,
    ProfileModule
  ],
  declarations: [
    AppointmentComponent
  ],
  exports: [
    AppointmentComponent
  ]
})
export class AppointmentModule { }
