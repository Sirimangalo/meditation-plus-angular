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
import { AnalyticsService } from './analytics/analytics.service';
import { BroadcastFormComponent } from './broadcast/broadcast-form.component';
import { BroadcastService } from './broadcast/broadcast.service';
import { TestimonialAdminComponent } from './testimonial/testimonial-admin.component';
import { UserAdminComponent } from './user/user-admin.component';
import { UserAdminFormComponent } from './user/user-admin-form.component';
import { UserModule } from '../user';
import { ProfileModule } from '../profile';
import { EmojiModule } from '../emoji';
import { MomentModule } from 'angular2-moment';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { AnalyticsComponent } from './analytics/analytics.component';
import { WorldChartComponent } from './analytics/worldmap-chart/worldmap-chart.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    UserModule,
    ProfileModule,
    EmojiModule,
    MomentModule,
    ChartsModule
  ],
  providers: [
    BroadcastService,
    AnalyticsService
  ],
  declarations: [
    AdminComponent,
    AdminIndexComponent,
    AnalyticsComponent,
    AppointmentAdminComponent,
    AppointmentFormComponent,
    CommitmentFormComponent,
    CommitmentAdminComponent,
    BroadcastFormComponent,
    BroadcastAdminComponent,
    TestimonialAdminComponent,
    UserAdminComponent,
    UserAdminFormComponent,
    WorldChartComponent
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
    UserAdminFormComponent,
    WorldChartComponent
  ]
})
export class AdminModule { }
