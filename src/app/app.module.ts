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
import { AppComponent } from './app.component';
import { AppState } from './app.service';
import { Home } from './home';
import { Login } from './login';
import { NotFoundComponent } from './not-found';
import { ProfileComponent, ProfileFormComponent } from './profile';
import { AppointmentComponent } from './appointment';
import { HelpComponent } from './help';
import { LiveComponent } from './live';
import { AdminModule } from './admin';
import { MessageModule } from './message';
import { MeditationModule } from './meditation';
import { QuestionModule } from './question';
import { TestimonialModule } from './testimonial';
import { UserModule } from './user';
import { ProfileModule } from './profile';
import { OnlineComponent } from './online';
import { CommitmentComponent } from './commitment';
import { UpdateComponent } from './update';

// Application wide providers
const APP_PROVIDERS = [
  AppState
];

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [
    AppComponent,
    Home,
    Login,
    NotFoundComponent,
    HelpComponent,
    LiveComponent,
    OnlineComponent,
    CommitmentComponent,
    UpdateComponent,
    AppointmentComponent,
  ],
  imports: [
    BrowserModule,
    MomentModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES, { useHash: true }),
    // Application Modules
    AdminModule,
    UserModule,
    ProfileModule,
    TestimonialModule,
    MessageModule,
    MeditationModule,
    QuestionModule
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
