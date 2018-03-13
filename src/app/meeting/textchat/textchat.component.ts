import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import { MeetingService } from '../meeting.service';
import { Meeting } from '../meeting';

@Component({
  selector: 'meeting-textchat',
  templateUrl: './textchat.component.html',
  styleUrls: ['./textchat.component.styl']
})
export class TextchatComponent {
  @Input() meeting: Meeting;
  @Input() preview = false;

  @ViewChild('messageList', {read: ElementRef}) messageList: ElementRef;

  currentMessage = '';

  constructor(
    private meetingService: MeetingService
  ) {
    this.meetingService
      .on('message', false)
      .subscribe(message => {
        this.meeting.messages.push(message);
        this.scrollToBottom();
      });

    this.scrollToBottom();
  }

  scrollToBottom() {
    window.setTimeout(() => {
      const lastRow = this.messageList.nativeElement.querySelector('.message-row:last-child');

      if (lastRow) {
        lastRow.scrollIntoView(false);
      }
    }, 10);
  }

  /**
   * Method for improving performance for iterating with ngFor
   */
  trackById(index, item) {
    return item._id;
  }

  /**
   * Send a message to opponent.
   *
   * @param {any} evt  DOM Event
   */
  sendMessage(evt: any = null) {
    if (!this.meeting || this.preview) {
      return;
    }

    if (evt) {
      evt.preventDefault();
    }

    this.meetingService
      .sendMessage(this.meeting._id, this.currentMessage)
      .subscribe(() => this.currentMessage = '');
  }
}
