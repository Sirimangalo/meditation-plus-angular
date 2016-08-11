import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from '../user/user.service';
import { Observable } from 'rxjs/Rx';
import { AppState } from '../';
import { Country } from '../profile/country';

@Component({
  selector: 'user-form',
  template: require('./user-form.component.html'),
  styles: [
    require('./user-form.component.css')
  ]
})
export class UserFormComponent {

  @Input() model: any = {};
  @Output() modelChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() admin: boolean = false;

  countryList = Country.list;
  sounds: Object[] = [
    { name: 'Bell 1', src: '/assets/audio/bell.mp3'},
    { name: 'Bell 2', src: '/assets/audio/bell1.mp3'},
    { name: 'Birds', src: '/assets/audio/birds.mp3'},
    { name: 'Bowl', src: '/assets/audio/bowl.mp3'},
    { name: 'Gong', src: '/assets/audio/gong.mp3'}
  ];
  currentSound;

  playSound() {
    if (this.model.sound){
      this.currentSound = new Audio(this.model.sound);
      this.currentSound.play();
    }
  }

  stopSound() {
    if (this.currentSound){
      this.currentSound.pause();
      this.currentSound.currentTime = 0;
    }
  }
}
