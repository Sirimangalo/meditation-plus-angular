import { Component, ViewChild, ElementRef, ApplicationRef } from '@angular/core';
import { MessageService } from './message.service';
import { Observable } from 'rxjs/Rx';
import { Response } from '@angular/http';
import { EmojiSelectComponent } from '../emoji';
import { UserService } from '../user/user.service';
import { MessageListEntryComponent } from './list-entry/message-list-entry.component';

@Component({
  selector: 'message',
  template: require('./message.html'),
  directives: [EmojiSelectComponent, MessageListEntryComponent],
  styles: [
    require('./message.css')
  ]
})
export class MessageComponent {

  @ViewChild('messageList', {read: ElementRef}) messageList: ElementRef;

  messages: Object[];
  messageSocket;
  currentMessage: string = '';
  lastScrollTop: number = 0;
  lastScrollHeight: number = 0;
  showEmojiSelect: boolean = false;
  loadedInitially: boolean = false;
  sending: boolean = false;

  constructor(
    public messageService: MessageService,
    public userService: UserService,
    private appRef: ApplicationRef
  ) {
  }

  get isAdmin(): boolean {
    return this.userService.isAdmin();
  }

  emojiSelect(evt) {
    this.currentMessage += ':' + evt + ':';
    this.showEmojiSelect = false;
  }

  scroll() {
    this.lastScrollHeight = this.messageList.nativeElement.scrollHeight;
    this.lastScrollTop = this.messageList.nativeElement.scrollTop;
  }

  /**
   * Load all messages at once
   */
  loadMessages() {
    this.messageService.getRecent()
      .map(res => res.json())
      .subscribe(data => {
        this.messages = data;
        this.appRef.tick();
        this.scrollToBottom();
        this.loadedInitially = true;
      });
  }

  /**
   * Method for handling single incoming messages
   * @param {object} data Message object
   */
  messageHandler(data) {
    this.messages.push(data);

    this.appRef.tick();

    // scroll to bottom if at bottom
    if (this.lastScrollTop + 5 >= this.lastScrollHeight
      - this.messageList.nativeElement.offsetHeight) {
      this.scrollToBottom();
    }
  }

  sendMessage(evt) {
    evt.preventDefault();

    if (!this.currentMessage)
      return;

    this.sending = true;
    this.messageService.post(this.currentMessage)
      .subscribe(() => {
        this.sending = false;
        this.currentMessage = '';
      }, (err) => {
        this.sending = false;
        console.error(err);
      });
  }

  ngOnInit() {
    // getting chat data instantly
    this.loadMessages();

    // subscribe to the websocket
    this.messageSocket = this.messageService.getSocket()
      .subscribe(data => { this.messageHandler(data); });

    // subscribe to a bigger interval for messages websocket misses
    Observable.interval(60000)
      .switchMap(() => this.messageService.getRecent())
      .map(res => (<any>res).json())
      .flatMap(res => res)
      .filter(res => {
        const index = this.messages.map(m => (<any>m)._id).indexOf((<any>res)._id);

        if (index > -1) {
          // update message
          (<any>this.messages[index]).ago = (<any>res).ago;
          (<any>this.messages[index]).text = (<any>res).text;

          return false;
        }

        return true;
      })
      .subscribe(data => { this.messageHandler(data); });
  }

  scrollToBottom() {
    this.messageList.nativeElement.scrollTop = this.messageList.nativeElement.scrollHeight;
  }

  ngOnDestroy() {
    this.messageSocket.unsubscribe();
  }
}
