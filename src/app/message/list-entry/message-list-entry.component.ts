import {
  Component,
  Pipe,
  Input,
  ChangeDetectionStrategy,
  ViewChild,
  Output,
  EventEmitter
} from '@angular/core';
import { MdMenuTrigger } from '@angular2-material/menu';
import { MessageService } from '../message.service';
import { Message } from '../message';
import * as moment from 'moment';

@Component({
  selector: 'message-list-entry',
  template: require('./message-list-entry.component.html'),
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    require('./message-list-entry.component.css')
  ]
})
export class MessageListEntryComponent {

  @Input() message: Message;
  @Input() admin: boolean = false;
  @Input() menuOpen: boolean = false;
  @ViewChild(MdMenuTrigger) trigger: MdMenuTrigger;
  @Output() menuOpened: EventEmitter<any> = new EventEmitter<any>();
  @Output() menuClosed: EventEmitter<any> = new EventEmitter<any>();
  localMenuOpen: boolean = false;

  constructor(public messageService: MessageService) {}

  ngOnInit() {
    this.trigger.onMenuClose.subscribe(() => {
      this.menuClosed.emit();
      this.localMenuOpen = false;
    });
  }

  getUserId(): string {
    return window.localStorage.getItem('id');
  }

  showMenu() {
    // prevent opening when other menu is opened or
    // if the message is deleted. Or if current user not creator
    // of message.
    if (this.menuOpen
      || this.message.deleted
      || (!this.message.user
        || this.getUserId() !== this.message.user._id)
      && !this.admin
    ) {
      return;
    }

    this.localMenuOpen = true;
    this.trigger.openMenu();
    this.menuOpened.emit();
  }

  delete() {
    if (!confirm('Are you sure?')) {
      return;
    }

    this.message.deleted = true;
    this.messageService.delete(this.message)
      .subscribe(() => {});
  }

  closeMenu() {
    this.trigger.closeMenu();
    this.menuClosed.emit();
  }

  edit() {
    const newText = prompt('Please enter your updated message:', this.message.text);
    if (newText === this.message.text || !newText) {
      return;
    }

    this.message.text = newText;
    this.message.edited = true;
    this.messageService.update(this.message)
      .subscribe(() => {});
  }

  editDone() {
    if (this.admin) {
      return false;
    }

    const created = moment(this.message.createdAt);
    const now = moment();
    const duration = moment.duration(now.diff(created));

    return duration.asMinutes() >= 30;
  }
}
