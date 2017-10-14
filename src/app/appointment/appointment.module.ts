import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared';
import { ProfileModule } from '../profile';
import { AppointmentComponent } from './appointment.component';
import { FormatHourPipe } from './hour.pipe';

@NgModule({
  imports: [
    RouterModule,
    SharedModule,
    ProfileModule
  ],
  declarations: [
    AppointmentComponent,
    FormatHourPipe
  ],
  exports: [
    AppointmentComponent,
    FormatHourPipe
  ]
})
export class AppointmentModule { }
