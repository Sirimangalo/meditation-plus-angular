import {
  Component,
  Input,
  ChangeDetectionStrategy,
  ViewChild,
  Output,
  EventEmitter,
  OnInit
} from '@angular/core';
import { MatMenuTrigger } from '@angular/material';
import { MessageService } from '../message.service';
import { Message } from '../message';
import * as moment from 'moment';

@Component({
  selector: 'message-list-entry',
  templateUrl: './message-list-entry.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: [
    './message-list-entry.component.styl'
  ]
})
export class MessageListEntryComponent implements OnInit {

  @Input() public message: Message;
  @Input() public admin = false;
  @Input() public menuOpen = false;
  @ViewChild(MatMenuTrigger) public trigger: MatMenuTrigger;
  @Output() public menuOpened: EventEmitter<any> = new EventEmitter<any>();
  @Output() public menuClosed: EventEmitter<any> = new EventEmitter<any>();
  public localMenuOpen = false;

  constructor(public messageService: MessageService) {}

  public ngOnInit() {
    this.trigger.onMenuClose.subscribe(() => {
      this.menuClosed.emit();
      this.localMenuOpen = false;
    });
  }

  public getUserId(): string {
    return window.localStorage.getItem('id');
  }

  public showMenu() {
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

  public delete() {
    if (!confirm('Are you sure?')) {
      return;
    }

    this.message.deleted = true;
    this.messageService.delete(this.message)
      .subscribe(() => undefined);
  }

  public closeMenu() {
    this.trigger.closeMenu();
    this.menuClosed.emit();
  }

  public edit() {
    const newText = prompt('Please enter your updated message:', this.message.text);
    if (newText === this.message.text || !newText) {
      return;
    }

    this.message.text = newText;
    this.message.edited = true;
    this.messageService.update(this.message)
      .subscribe(() => undefined);
  }

  public editDone() {
    if (this.admin) {
      return false;
    }

    const created = moment(this.message.createdAt);
    const now = moment();
    const duration = moment.duration(now.diff(created));

    return duration.asMinutes() >= 30;
  }
}
