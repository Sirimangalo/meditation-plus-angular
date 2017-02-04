import { NgModule } from '@angular/core';
import { SharedModule } from '../shared';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AdminIndexComponent } from './admin-index.component';
import { AppointmentAdminComponent } from './appointment/appointment-admin.component';
import { AppointmentFormComponent } from './appointment/appointment-form.component';
import { CommitmentAdminComponent } from './commitment/commitment-admin.component';
import { CommitmentFormComponent } from './commitment/commitment-form.component';
import { BroadcastAdminComponent } from './broadcast/broadcast-admin.component';
import { BroadcastFormComponent } from './broadcast/broadcast-form.component';
import { BroadcastService } from './broadcast/broadcast.service';
import { TestimonialAdminComponent } from './testimonial/testimonial-admin.component';
import { UserAdminComponent } from './user/user-admin.component';
import { UserAdminFormComponent } from './user/user-admin-form.component';
import { UserModule } from '../user';
import { ProfileModule } from '../profile';
import { EmojiModule } from '../emoji';
import { MomentModule } from 'angular2-moment';

@NgModule({
  imports: [
    SharedModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    UserModule,
    ProfileModule,
    EmojiModule,
    MomentModule
  ],
  providers: [
    BroadcastService
  ],
  declarations: [
    AdminComponent,
    AdminIndexComponent,
    AppointmentAdminComponent,
    AppointmentFormComponent,
    CommitmentFormComponent,
    CommitmentAdminComponent,
    BroadcastFormComponent,
    BroadcastAdminComponent,
    TestimonialAdminComponent,
    UserAdminComponent,
    UserAdminFormComponent
  ],
  exports: [
    AdminComponent,
    AdminIndexComponent,
    AppointmentAdminComponent,
    AppointmentFormComponent,
    CommitmentFormComponent,
    CommitmentAdminComponent,
    BroadcastFormComponent,
    BroadcastAdminComponent,
    TestimonialAdminComponent,
    UserAdminComponent,
    UserAdminFormComponent
  ]
})
export class AdminModule { }
