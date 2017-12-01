import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { MessageService } from 'app/message/message.service';
import { switchMap, map } from 'rxjs/operators';
import { SyncMessages, SYNC, SyncMessagesDone } from '../actions/message.actions';
import { of } from 'rxjs/observable/of';

@Injectable()
export class SyncMessageEffect {
  constructor(
    private actions$: Actions,
    private service: MessageService,
  ) {
  }

  @Effect()
  sync$ = this.actions$
    .ofType<SyncMessages>(SYNC)
    .pipe(
      map(action => action.payload),
      switchMap(payload =>
        this.service.synchronize(payload.from, payload.to.toDate()).pipe(
          map(res => res.json()),
          switchMap(messages => of(new SyncMessagesDone({ index: payload.index, messages })))
        )
      )
    );
}
