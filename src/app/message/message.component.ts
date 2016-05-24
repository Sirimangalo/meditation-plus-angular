import { Component, Pipe, PipeTransform } from '@angular/core';
import { MessageService } from './message.service';
import { Router } from '@angular/router-deprecated';
import { Observable } from 'rxjs/Rx';
import { TimeAgoPipe } from 'angular2-moment';

/**
 * Inline Pipe to shorten the output of the TimeAgoPipe
 */
@Pipe({ name: 'shortenTimeAgo', pure: false })
class ShortenTimeAgo implements PipeTransform {
  transform(value: string): string {
    value = value.replace(/ days/, 'd');
    value = value.replace(/a few seconds/, 'secs');
    value = value.replace(/ seconds/, 's');
    value = value.replace(/a minute/, '1m');
    value = value.replace(/ minutes/, 'm');
    value = value.replace(/ hours/, 'h');
    return value;
  }
}

@Component({
  selector: 'message',
  template: require('./message.html'),
  pipes: [TimeAgoPipe, ShortenTimeAgo],
  styles: [
    require('./message.css')
  ]
})
export class MessageComponent {

  messages: Object[];
  messageSubscription;
  currentMessage: string = '';

  constructor(
    public messageService: MessageService,
    public router: Router
  ) {

  }

  pollMessages() {
    return Observable.interval(2000)
      .switchMap(() => this.messageService.getRecent())
      .map(res => res.json());
  }

  loadMessages() {
    this.messageService.getRecent()
      .map(res => res.json())
      .subscribe(data => this.messages = data);
  }

  sendMessage(evt) {
    evt.preventDefault();

    if (!this.currentMessage)
      return;

    this.messageService.post(this.currentMessage)
      .subscribe(() => {
        this.currentMessage = '';
        this.loadMessages();
      }, (err) => {
        console.error(err);
      });
  }

  ngOnInit() {
    // getting chat data instantly
    this.loadMessages();

    // subscribe for an refresh interval after
    this.messageSubscription = this.pollMessages()
      .subscribe(data => this.messages = data);
  }

  ngOnDestroy() {
    this.messageSubscription.unsubscribe();
  }
}
