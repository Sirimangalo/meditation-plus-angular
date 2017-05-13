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
import { AppState, InternalStateType } from './app.service';
import { HomeComponent } from './home';
import { LoginComponent } from './login';
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
import { ResetPasswordComponent } from './reset-password';

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
    HelpComponent,
    LiveComponent,
    OnlineComponent,
    CommitmentComponent,
    UpdateComponent,
    AppointmentComponent,
    ResetPasswordComponent
  ],
  imports: [
    BrowserModule,
    MomentModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES, { useHash: true, preloadingStrategy: PreloadAllModules }),
    // Application Modules
    AdminModule,
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
