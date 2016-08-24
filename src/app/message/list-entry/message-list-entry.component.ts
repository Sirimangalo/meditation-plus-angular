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
import { MessageService } from '../message.service';

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
  @Input() showQuestionsOnly: boolean = false;
  @Input() isAdmin: boolean = false;

  constructor(public messageService: MessageService) {}

  markAsAnswered(message) {
    if (this.isAdmin
      && this.isQuestion(message.text)
      && !message.answered
      && !message.loading
    ) {
      message.loading = true;
      this.messageService.answerQuestion(message._id)
        .subscribe(() => {
         message.answered = true;
         message.loading = false;
        }, (err) => {
          console.error(err);
        });
    }
  }

  isQuestion(str: string): boolean {
    return str.toLowerCase().indexOf(':question:') >= 0
      || <boolean>Boolean(str.match(/^Q:.*/gi));
  }
}
