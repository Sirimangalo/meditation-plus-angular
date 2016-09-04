import {
  Component,
  Pipe,
  Input,
  ChangeDetectionStrategy
} from '@angular/core';
import { MessageService } from '../message.service';

@Component({
  selector: 'message-list-entry',
  template: require('./message-list-entry.component.html'),
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    require('./message-list-entry.component.css')
  ]
})
export class MessageListEntryComponent {

  @Input() message: any;

  constructor(public messageService: MessageService) {}
}
