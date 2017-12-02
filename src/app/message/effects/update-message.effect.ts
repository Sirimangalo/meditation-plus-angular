import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { MessageService } from 'app/message/message.service';
import { switchMap, map } from 'rxjs/operators';
import { UPDATE, UpdateMessage } from '../actions/message.actions';

@Injectable()
export class UpdateMessageEffect {
  constructor(
    private actions$: Actions,
    private service: MessageService
  ) {
  }

  @Effect({ dispatch: false })
  post$ = this.actions$
    .ofType<UpdateMessage>(UPDATE)
    .pipe(
      map(action => action.payload),
      switchMap(payload => this.service.update(payload))
    );
}
