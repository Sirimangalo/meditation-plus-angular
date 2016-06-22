
// Angular 2
import { enableProdMode } from '@angular/core';
import { UserService } from '../app/user/user.service';
import { MessageService } from '../app/message/message.service';
import { CommitmentService } from '../app/commitment/commitment.service';
import { MeditationService } from '../app/meditation/meditation.service';
import { AppointmentService } from '../app/appointment/appointment.service';
import { AUTH_PROVIDERS } from 'angular2-jwt';

// Environment Providers
let PROVIDERS = [
  UserService,
  MessageService,
  MeditationService,
  CommitmentService,
  AppointmentService,
  AUTH_PROVIDERS
];

if ('production' === ENV) {
  // Production
  enableProdMode();

  PROVIDERS = [
    ...PROVIDERS
  ];

} else {
  // Development
  PROVIDERS = [
    ...PROVIDERS
  ];

}


export const ENV_PROVIDERS = [
  ...PROVIDERS
];
