import {
  Component,
  Pipe,
  PipeTransform,
  ViewChild,
  ElementRef,
  ApplicationRef
} from '@angular/core';
import { MessageService } from './message.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Response } from '@angular/http';
import { DateFormatPipe } from 'angular2-moment';
import { AvatarDirective } from '../profile';
import { EmojiSelectComponent, EmojiPipe } from '../emoji';
import { LinkyPipe } from 'angular2-linky/linky-pipe';

@Component({
  selector: 'message',
  template: require('./message.html'),
  pipes: [DateFormatPipe, EmojiPipe, LinkyPipe],
  directives: [AvatarDirective, EmojiSelectComponent],
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

  constructor(
    public messageService: MessageService,
    public router: Router,
    private appRef: ApplicationRef
  ) {

  }

  emojiSelect(evt) {
    this.currentMessage += ':' + evt + ':';
    this.showEmojiSelect = false;
  }

  scroll() {
    this.lastScrollHeight = this.messageList.nativeElement.scrollHeight;
    this.lastScrollTop = this.messageList.nativeElement.scrollTop;
  }

  getUrlString(url) {
    return 'url("' + url + '")';
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

    this.messageService.post(this.currentMessage)
      .subscribe(() => {
        this.currentMessage = '';
      }, (err) => {
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

  isQuestion(str: string): boolean {
    return str.indexOf(':question:') >= 0 ? true : false;
  }

  ngOnDestroy() {
    this.messageSocket.unsubscribe();
  }
}
