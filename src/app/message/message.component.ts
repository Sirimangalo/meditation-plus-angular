import {
  ApplicationRef,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { UserService } from '../user/user.service';
import { Message } from './message';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { AppState } from 'app/reducers';
import {
  selectMessageList,
  selectUsernames,
  selectLoading,
  selectLoadedPage,
  selectNoPagesLeft,
  selectPosting,
  selectCurrentMessage,
  selectInitiallyLoaded,
  selectMessages
} from 'app/message/reducers/message.reducers';
import { take, filter, map } from 'rxjs/operators';
import { NgZone } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  SetCurrentMessage,
  LoadMessages,
  UpdateMessage,
  PostMessage,
  AutocompleteUser,
  DeleteMessage
} from 'app/message/actions/message.actions';

@Component({
  selector: 'message',
  templateUrl: './message.component.html',
  styleUrls: [
    './message.component.styl'
  ]
})
export class MessageComponent implements OnInit {

  @Output() loadingFinished: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('messageList', {read: ElementRef}) messageList: ElementRef;

  messages$: Observable<Message[]>;
  usernames$: Observable<string[]>;
  loading$: Observable<boolean>;
  initiallyLoaded$: Observable<boolean>;
  page$: Observable<number>;
  noPagesLeft$: Observable<boolean>;
  posting$: Observable<boolean>;

  lastScrollTop = 0;
  lastScrollHeight = 0;
  showEmojiSelect = false;
  menuOpen = false;

  form: FormGroup;
  message: FormControl;

  constructor(
    public userService: UserService,
    public appRef: ApplicationRef,
    public store: Store<AppState>,
    private zone: NgZone
  ) {
    this.form = new FormGroup({
      message: new FormControl()
    });
    this.message = this.form.get('message') as FormControl;

    this.messages$ = store.select(selectMessageList);
    this.usernames$ = store.select(selectUsernames);
    this.loading$ = store.select(selectLoading);
    this.initiallyLoaded$ = store.select(selectInitiallyLoaded);
    this.page$ = store.select(selectLoadedPage);
    this.noPagesLeft$ = store.select(selectNoPagesLeft);
    this.posting$ = store.select(selectPosting);

    // Load first page, if no page was loaded
    store.select(selectMessages).pipe(
      take(1),
      map(val => val.loadedPage),
      filter(val => val === 0)
    )
    .subscribe(() => store.dispatch(new LoadMessages(0)));

    this.posting$.subscribe(val => val
      ? this.message.disable()
      : this.message.enable()
    );

    store.select(selectCurrentMessage).subscribe(
      val => this.message.setValue(val, { emitEvent: false })
    );
  }

  ngOnInit() {
    this.registerScrolling();

    this.messages$
      .filter(() => this.lastScrollTop + 5 >= this.lastScrollHeight
        - this.messageList.nativeElement.offsetHeight)
      .subscribe(() => this.scrollToBottom());

    this.loadingFinished.emit();
  }

  delete(message: Message) {
    this.store.dispatch(new DeleteMessage(message));
  }

  update(message: Message) {
    this.store.dispatch(new UpdateMessage(message));
  }

  loadNextPage() {
    this.page$.pipe(take(1))
      .subscribe(page => this.store.dispatch(new LoadMessages(page + 1)));
  }

  get isAdmin(): boolean {
    return this.userService.isAdmin();
  }

  emojiSelect(evt) {
    this.message.setValue(`${this.message.value}:${evt}:`);
    this.showEmojiSelect = false;
  }

  sendMessage(evt: KeyboardEvent) {
    evt.preventDefault();
    if (!this.message.value.trim()) {
      return;
    }
    this.store.dispatch(new SetCurrentMessage(this.message.value));
    this.store.dispatch(new PostMessage());
  }

  autocomplete(evt: KeyboardEvent) {
    evt.preventDefault();
    this.store.dispatch(new SetCurrentMessage(this.message.value));
    this.store.dispatch(new AutocompleteUser(
      (evt.target as HTMLTextAreaElement).selectionEnd
        ? (evt.target as HTMLTextAreaElement).selectionEnd
        : this.message.value.length
    ));
  }

  /**
   * Registers scrolling as observable. Running this outside of zone to ignore
   * a change detection run on every scroll event. This resulted in a huge performance boost.
   */
  registerScrolling() {
    this.zone.runOutsideAngular(() => {
      let scrollTimer = null;
      this.messageList.nativeElement.addEventListener('scroll', () => {
        if (scrollTimer !== null) {
          clearTimeout(scrollTimer);
        }
        scrollTimer = setTimeout(() => {
          this.lastScrollHeight = this.messageList.nativeElement.scrollHeight;
          this.lastScrollTop = this.messageList.nativeElement.scrollTop;
        }, 150);
      }, false);
    });
  }

  scrollToBottom() {
    window.setTimeout(() => {
      this.messageList.nativeElement.scrollTop = this.messageList.nativeElement.scrollHeight;
    }, 10);
  }

  trackById(_index, item: Message) {
    return item._id;
  }
}
