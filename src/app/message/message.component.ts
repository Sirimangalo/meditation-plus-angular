import { Component, ViewChild, ElementRef, ApplicationRef } from '@angular/core';
import { MessageService } from './message.service';
import { Observable } from 'rxjs/Rx';
import { Response } from '@angular/http';
import { UserService } from '../user/user.service';
import { Message, MessageWebsocketResponse } from './message';
import * as moment from 'moment';
import { WebsocketService } from '../shared';

@Component({
  selector: 'message',
  template: require('./message.component.html'),
  styles: [
    require('./message.component.css')
  ]
})
export class MessageComponent {

  @ViewChild('messageList', {read: ElementRef}) messageList: ElementRef;

  messages: Message[];
  messageSocket;
  updateSocket;
  currentMessage: string = '';
  lastScrollTop: number = 0;
  lastScrollHeight: number = 0;
  showEmojiSelect: boolean = false;
  loadedInitially: boolean = false;
  sending: boolean = false;
  loadedPage: number = 0;
  noMorePages: boolean = false;
  loadingPage: boolean = false;
  menuOpen: boolean = false;

  constructor(
    public messageService: MessageService,
    public userService: UserService,
    public appRef: ApplicationRef,
    public wsService: WebsocketService
  ) {
  }

  get isAdmin(): boolean {
    return this.userService.isAdmin();
  }

  emojiSelect(evt) {
    this.currentMessage += ':' + evt + ':';
    this.showEmojiSelect = false;
  }

  loadMessages(page: number = 0) {
    this.loadingPage = true;
    this.messageService.getRecent(page)
      .map(res => res.json())
      .subscribe((data: Message[]) => {
        if (page === 0) {
          this.loadedInitially = true;
          this.messages = data;
          this.appRef.tick();
          this.scrollToBottom();
        } else {
          this.messages.unshift(...data);
        }

        this.loadingPage = false;
        this.loadedPage = page;

        if (page > 0 && data.length === 0) {
          this.noMorePages = true;
        }
      }, () => this.loadingPage = false);
  }

  /**
   * Method for handling single incoming messages
   * @param {object} data Message object
   */
  messageHandler(data: MessageWebsocketResponse) {
    this.messages.push(data.current);

    // resort messages
    this.messages.sort((a: any, b: any) => {
      return moment(a.createdAt).unix() - moment(b.createdAt).unix();
    });

    // check if messages are missing
    const lastMessage = this.messages[this.messages.length - 2];
    if (!moment(lastMessage.createdAt).isSame(data.previous.createdAt)) {
      this.synchronize(this.messages.length - 2, lastMessage, moment(data.previous.createdAt));
    }

    this.appRef.tick();

    // scroll to bottom if at bottom
    if (this.lastScrollTop + 5 >= this.lastScrollHeight
      - this.messageList.nativeElement.offsetHeight) {
      this.scrollToBottom();
    }
  }

  synchronize(index: number, lastReceived: Message, toDate: moment.Moment) {
    this.messageService.synchronize(lastReceived.createdAt, toDate.toDate())
      .map(res => res.json())
      .subscribe((data: Message[]) => {
        this.messages.splice(index, 0, ...data);

        // resort messages
        this.messages.sort((a: any, b: any) => {
          return moment(a.createdAt).unix() - moment(b.createdAt).unix();
        });

        this.appRef.tick();

        // scroll to bottom if at bottom
        if (this.lastScrollTop + 5 >= this.lastScrollHeight
          - this.messageList.nativeElement.offsetHeight) {
          this.scrollToBottom();
        }
      });
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

  /**
   * Registers scrolling as observable.
   */
  registerScrolling() {
    let scrolls = Observable.fromEvent(this.messageList.nativeElement, 'scroll');

    let scrollStart = scrolls
      .debounceTime(100)
      .flatMap(ev => scrolls.take(1))
      .map(() => true);

    let scrollStop = scrollStart.flatMap(
      () => scrolls
        .skipUntil(scrollStart)
        .debounceTime(100)
        .take(1)
    ).map(() => false);

    let scrolling = scrollStart
      .merge(scrollStop)
      .distinctUntilChanged()
      .subscribe(isScrolling => {
        this.lastScrollHeight = this.messageList.nativeElement.scrollHeight;
        this.lastScrollTop = this.messageList.nativeElement.scrollTop;
      });
  }

  updateMessage(message: Message) {
    this.messages = this.messages
      .map(val => {
        if (val._id === message._id) {
          return message;
        }

        return val;
      });
  }

  ngOnInit() {
    this.registerScrolling();

    // getting chat data instantly
    this.loadMessages();

    // subscribe to the websocket
    this.messageSocket = this.messageService.getNewMessageSocket()
      .subscribe(data => { this.messageHandler(data); });

    // synchronize messages on reconnection
    this.wsService.onConnected()
      .subscribe(data => {
        if (!this.messages || this.messages.length === 0) {
          return;
        }

        const lastMessage = this.messages[this.messages.length - 1];
        // check if messages are missing
        if (!moment(lastMessage.createdAt).isSame(data.latestMessage.createdAt)) {
          this.synchronize(
            this.messages.length - 1,
            lastMessage,
            moment(data.latestMessage.createdAt)
          );
        }
      });

    // subscribe to message updates
    this.updateSocket = this.messageService.getUpdateSocket()
      .map(res => res.populated)
      .subscribe(data => this.updateMessage(data));
  }

  scrollToBottom() {
    this.messageList.nativeElement.scrollTop = this.messageList.nativeElement.scrollHeight;
  }

  ngOnDestroy() {
    this.messageSocket.unsubscribe();
    this.updateSocket.unsubscribe();
  }
}
