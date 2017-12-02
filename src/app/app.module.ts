import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, PreloadAllModules } from '@angular/router';
import 'hammerjs';
import { MomentModule } from 'angular2-moment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';
import { ROUTES } from './app.routes';
// App is our top level component
import { AppComponent } from './app.component';
import { AppState } from './app.service';
import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { NotFoundComponent } from './not-found';
import { LiveComponent } from './live';
import { AdminModule } from './admin';
import { AppointmentModule } from './appointment';
import { AppointmentCallModule } from './appointment-call';
import { MessageModule } from './message';
import { MeditationModule } from './meditation';
import { QuestionModule } from './question';
import { TestimonialModule } from './testimonial';
import { UserModule } from './user';
import { ProfileModule } from './profile';
import { OnlineComponent } from './online';
import { CommitmentComponent } from './commitment';
import { UpdateComponent } from './update';
import { ResetPasswordComponent } from './reset-password';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { appReducers, metaReducers } from 'app/reducers';
import { environment } from 'environments/environment';
import { EffectsModule } from '@ngrx/effects';

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
    HomeComponent,
    LoginComponent,
    NotFoundComponent,
    LiveComponent,
    OnlineComponent,
    CommitmentComponent,
    UpdateComponent,
    ResetPasswordComponent
  ],
  imports: [
    BrowserModule,
    MomentModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpModule, // still needed for angular2-jwt
    RouterModule.forRoot(ROUTES, { useHash: true, preloadingStrategy: PreloadAllModules }),
    StoreModule.forRoot(appReducers, { metaReducers }),
    EffectsModule.forRoot([]),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    // Application Modules
    AdminModule,
    AppointmentModule,
    AppointmentCallModule,
    UserModule,
    ProfileModule,
    TestimonialModule,
    MessageModule,
    MeditationModule,
    QuestionModule,
    BrowserAnimationsModule
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    ENV_PROVIDERS,
    APP_PROVIDERS
  ]
})
export class AppModule {
  constructor(public appRef: ApplicationRef, public appState: AppState) {}
}
