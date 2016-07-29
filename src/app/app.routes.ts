import { RouterConfig } from '@angular/router';
import { Home } from './home';
import { Login } from './login';
import { ProfileComponent, ProfileFormComponent } from './profile';
import { AppointmentComponent } from './appointment';
import { HelpComponent } from './help';
import { AdminComponent } from './admin';
import { CommitmentAdminComponent } from './admin/commitment/commitment-admin.component';
import { CommitmentFormComponent } from './admin/commitment/commitment-form.component';
import { AppointmentAdminComponent } from './admin/appointment/appointment-admin.component';
import { AppointmentFormComponent } from './admin/appointment/appointment-form.component';
import { AuthGuard } from './auth-guard';
import { LoginGuard } from './login-guard';
import { AdminGuard } from './admin-guard';

export const routes: RouterConfig = [
  { path: '', component: Home, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileFormComponent, canActivate: [AuthGuard] },
  { path: 'profile/:username', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'help', component: HelpComponent, canActivate: [AuthGuard] },
  { path: 'login', component: Login, canActivate: [LoginGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },
  { path: 'admin/commitments', component: CommitmentAdminComponent, canActivate: [AdminGuard] },
  { path: 'admin/commitments/new', component: CommitmentFormComponent, canActivate: [AdminGuard] },
  { path: 'admin/commitments/:id', component: CommitmentFormComponent, canActivate: [AdminGuard] },
  { path: 'admin/appointments', component: AppointmentAdminComponent, canActivate: [AdminGuard] },
  {
    path: 'admin/appointments/new',
    component: AppointmentFormComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'admin/appointments/:id',
    component: AppointmentFormComponent,
    canActivate: [AdminGuard]
  },
  { path: 'schedule', component: AppointmentComponent, canActivate: [AuthGuard] }
];
