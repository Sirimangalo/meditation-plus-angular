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
import { DateFormatPipe } from 'angular2-moment';

@Component({
  selector: 'message',
  template: require('./message.html'),
  pipes: [DateFormatPipe],
  styles: [
    require('./message.css')
  ]
})
export class MessageComponent {

  @ViewChild('messageList', {read: ElementRef}) messageList: ElementRef;

  messages: Object[];
  messageSubscription;
  currentMessage: string = '';
  lastScrollTop: number = 0;
  lastScrollHeight: number = 0;

  constructor(
    public messageService: MessageService,
    public router: Router,
    private appRef: ApplicationRef
  ) {

  }

  scroll() {
    this.lastScrollHeight = this.messageList.nativeElement.scrollHeight;
    this.lastScrollTop = this.messageList.nativeElement.scrollTop;
  }

  getUrlString(url) {
    return 'url("' + url + '")';
  }

  loadMessages() {
    this.messageService.getRecent()
      .map(res => res.json())
      .subscribe(data => {
        this.messages = data;
        this.appRef.tick();
        this.scrollToBottom();
      });
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

    // subscribe for an refresh interval after
    this.messageSubscription = this.messageService.getSocket()
      .subscribe(data => {
        this.messages.push(data);

        this.appRef.tick();

        // scroll to bottom if at bottom
        if (this.lastScrollTop + 5 >= this.lastScrollHeight - this.messageList.nativeElement.offsetHeight) {
          this.scrollToBottom();
        }
      });
  }

  scrollToBottom() {
    this.messageList.nativeElement.scrollTop = this.messageList.nativeElement.scrollHeight;
  }

  ngOnDestroy() {
    this.messageSubscription.unsubscribe();
  }
}
