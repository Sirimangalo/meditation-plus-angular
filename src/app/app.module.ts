import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { removeNgStyles, createNewHosts } from '@angularclass/hmr';
import { MaterialModule } from '../platform/angular2-material2';
import { MomentModule } from 'angular2-moment';
/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';
import { ROUTES } from './app.routes';
// App is our top level component
import { App } from './app.component';
import { AppState } from './app.service';
import { Home } from './home';
import { Login } from './login';
import { NotFoundComponent } from './not-found';
import { ProfileComponent, ProfileFormComponent } from './profile';
import { AppointmentComponent } from './appointment';
import { HelpComponent } from './help';
import { LiveComponent } from './live';
import { AdminComponent } from './admin';
import { AdminIndexComponent } from './admin';
import { OnlineComponent } from './online';
import { CommitmentComponent } from './commitment';
import { UpdateComponent } from './update';
import { CommitmentAdminComponent } from './admin/commitment/commitment-admin.component';
import { CommitmentFormComponent } from './admin/commitment/commitment-form.component';
import { AppointmentAdminComponent } from './admin/appointment/appointment-admin.component';
import { AppointmentFormComponent } from './admin/appointment/appointment-form.component';
import { UserAdminFormComponent } from './admin/user/user-admin-form.component';
import { UserAdminComponent } from './admin/user/user-admin.component';
import { TestimonialComponent } from './testimonial/testimonial.component';
import { TestimonialAdminComponent } from './admin/testimonial/testimonial-admin.component';

// Application wide providers
const APP_PROVIDERS = [
  AppState
];

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [ App ],
  declarations: [
    App,
    Home,
    Login,
    NotFoundComponent,
    ProfileComponent,
    ProfileFormComponent,
    AppointmentComponent,
    HelpComponent,
    LiveComponent,
    AdminComponent,
    AdminIndexComponent,
    OnlineComponent,
    CommitmentComponent,
    UpdateComponent,
    CommitmentAdminComponent,
    CommitmentFormComponent,
    AppointmentComponent,
    AppointmentAdminComponent,
    AppointmentFormComponent,
    UserAdminComponent,
    UserAdminFormComponent,
    TestimonialComponent,
    TestimonialAdminComponent
  ],
  imports: [ // import Angular's modules
    BrowserModule,
    MomentModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES, { useHash: true })
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    ENV_PROVIDERS,
    APP_PROVIDERS
  ]
})
export class AppModule {
  constructor(public appRef: ApplicationRef, public appState: AppState) {}
  hmrOnInit(store) {
    if (!store || !store.state) return;
    console.log('HMR store', store);
    this.appState._state = store.state;
    this.appRef.tick();
    delete store.state;
  }
  hmrOnDestroy(store) {
    let cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
    // recreate elements
    let state = this.appState._state;
    store.state = state;
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // remove styles
    removeNgStyles();
  }
  hmrAfterDestroy(store) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }
}
