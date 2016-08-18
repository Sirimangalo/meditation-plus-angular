import {
  Component,
  Pipe,
  Input,
  ChangeDetectionStrategy
} from '@angular/core';
import { DateFormatPipe } from 'angular2-moment';
import { AvatarDirective } from '../../profile';
import { EmojiPipe } from '../../emoji';
import { LinkyPipe } from 'angular2-linky/linky-pipe';
import { FlagComponent } from '../../profile/flag/flag.component';

@Component({
  selector: 'message-list-entry',
  template: require('./message-list-entry.component.html'),
  pipes: [DateFormatPipe, EmojiPipe, LinkyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [AvatarDirective, FlagComponent],
  styles: [
    require('./message-list-entry.component.css')
  ]
})
export class MessageListEntryComponent {

  @Input() message: any;

}
