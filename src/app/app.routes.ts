import { RouterConfig } from '@angular/router';
import { Home } from './home';
import { Login } from './login';
import { ProfileComponent, ProfileFormComponent } from './profile';
import { AppointmentComponent } from './appointment';
import { HelpComponent } from './help';
import { AdminComponent } from './admin';
import { AdminIndexComponent } from './admin';
import { OnlineComponent } from './online';
import { UpdateComponent } from './update';
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

export const routes: RouterConfig = [
  { path: '', component: Home, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileFormComponent, canActivate: [AuthGuard] },
  { path: 'profile/:id', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'help', component: HelpComponent, canActivate: [AuthGuard] },
  { path: 'online', component: OnlineComponent, canActivate: [AuthGuard] },
  { path: 'updated', component: UpdateComponent },
  { path: 'login', component: Login, canActivate: [LoginGuard] },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AdminGuard],
    children: [
      { path: '', component: AdminIndexComponent },
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
      { path: 'testimonials/review', component: TestimonialAdminComponent }
    ]
  },
  { path: 'schedule', component: AppointmentComponent, canActivate: [AuthGuard] },
  { path: 'testimonials', component: TestimonialComponent, canActivate: [AuthGuard] }
];
