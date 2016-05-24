
// Angular 2
import { enableProdMode } from '@angular/core';
import { UserService } from '../app/user/user.service';
import { MessageService } from '../app/message/message.service';
import { MeditationService } from '../app/meditation/meditation.service';
import { AUTH_PROVIDERS } from 'angular2-jwt';

// Environment Providers
let PROVIDERS = [
  UserService,
  MessageService,
  MeditationService,
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
