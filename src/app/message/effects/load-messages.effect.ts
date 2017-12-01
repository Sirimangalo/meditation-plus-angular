import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { MessageService } from 'app/message/message.service';
import { switchMap, map, tap } from 'rxjs/operators';
import { Message } from 'app/message/message';
import * as _ from 'lodash';
import { LOAD, LoadMessages, LoadMessagesDone } from 'app/message/actions/message.actions';
import { of } from 'rxjs/observable/of';

@Injectable()
export class LoadMessageEffect {
  constructor(
    private actions$: Actions,
    private service: MessageService
  ) {
  }

  @Effect()
  load$ = this.actions$
    .ofType<LoadMessages>(LOAD)
    .pipe(
      map(action => action.payload),
      switchMap(page =>
        this.service.getRecent(page).pipe(
          map(data => data.json()),
          tap(this.setLastMessage),
          switchMap(messages => of(new LoadMessagesDone({ messages, page })))
        )
      )
    );

  private setLastMessage(messages: Message[]) {
    if (messages.length === 0) {
      return;
    }
    window.localStorage.setItem(
      'lastMessage',
      _.last(messages).createdAt.toString()
    );
  }
}
