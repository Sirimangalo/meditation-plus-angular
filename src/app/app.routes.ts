import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { NotFoundComponent } from './not-found';
import { ProfileComponent, ProfileFormComponent } from './profile';
import { AppointmentComponent } from './appointment';
import { LiveComponent } from './live';
import { AdminComponent } from './admin';
import { AdminIndexComponent } from './admin';
import { OnlineComponent } from './online';
import { CommitmentComponent } from './commitment';
import { UpdateComponent } from './update';
import { WikiComponent } from './wiki';
import { WikiNewComponent } from './wiki';
import { CommitmentAdminComponent } from './admin/commitment/commitment-admin.component';
import { CommitmentFormComponent } from './admin/commitment/commitment-form.component';
import { AppointmentAdminComponent } from './admin/appointment/appointment-admin.component';
import { AppointmentFormComponent } from './admin/appointment/appointment-form.component';
import { UserAdminFormComponent } from './admin/user/user-admin-form.component';
import { UserAdminComponent } from './admin/user/user-admin.component';
import { TestimonialComponent } from './testimonial/testimonial.component';
import { TestimonialAdminComponent } from './admin/testimonial/testimonial-admin.component';
import { AuthGuard } from './auth-guard';
import { LoginGuard } from './login-guard';
import { AdminGuard } from './admin-guard';
import { BroadcastAdminComponent } from './admin/broadcast/broadcast-admin.component';
import { BroadcastFormComponent } from './admin/broadcast/broadcast-form.component';
import { AnalyticsComponent } from './admin/analytics/analytics.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

export const ROUTES: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileFormComponent, canActivate: [AuthGuard] },
  { path: 'profile/id/:id', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'profile/:username', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'online', component: OnlineComponent, canActivate: [AuthGuard] },
  { path: 'commit', component: CommitmentComponent, canActivate: [AuthGuard] },
  { path: 'live', component: LiveComponent, canActivate: [AuthGuard] },
  { path: 'updated', component: UpdateComponent },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AdminGuard],
    children: [
      { path: '', component: AdminIndexComponent },
      { path: 'broadcasts', component: BroadcastAdminComponent },
      { path: 'broadcasts/new', component: BroadcastFormComponent },
      { path: 'broadcasts/:id', component: BroadcastFormComponent },
      { path: 'commitments', component: CommitmentAdminComponent },
      { path: 'commitments/new', component: CommitmentFormComponent },
      { path: 'commitments/:id', component: CommitmentFormComponent },
      { path: 'appointments', component: AppointmentAdminComponent },
      { path: 'appointments/new', component: AppointmentFormComponent },
      { path: 'appointments/:id', component: AppointmentFormComponent },
      { path: 'users', component: UserAdminComponent },
      { path: 'users/new', component: UserAdminFormComponent },
      { path: 'users/:id', component: UserAdminFormComponent },
      { path: 'testimonials', component: TestimonialAdminComponent },
      { path: 'testimonials/:id', component: TestimonialAdminComponent },
      { path: 'testimonials', component: TestimonialAdminComponent },
      { path: 'testimonials/:id', component: TestimonialAdminComponent },
      { path: 'testimonials/review', component: TestimonialAdminComponent },
      { path: 'analytics', component: AnalyticsComponent }
    ]
  },
  { path: 'schedule', component: AppointmentComponent, canActivate: [AuthGuard] },
  { path: 'testimonials', component: TestimonialComponent, canActivate: [AuthGuard] },
  { path: 'wiki', component: WikiComponent, canActivate: [AuthGuard] },
  { path: 'wiki/new', component: WikiNewComponent, canActivate: [AuthGuard] },
  { path: 'reset-password', component: ResetPasswordComponent, canActivate: [LoginGuard] },
  { path: '**', component: NotFoundComponent }
];
