import { Component } from '@angular/core';
import { CanActivate, Router, RouteParams } from '@angular/router-deprecated';
import { loggedIn } from '../../logged-in.ts';

@Component({
  selector: 'help',
  template: require('./help.html'),
  styles: [
    require('./help.css')
  ]
})
@CanActivate((next, prev) => {
  return loggedIn(next, prev)
})
export class HelpComponent {

}
