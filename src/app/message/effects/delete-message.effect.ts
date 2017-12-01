import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { MessageService } from 'app/message/message.service';
import { switchMap, map } from 'rxjs/operators';
import { DELETE, DeleteMessage, DeleteMessageDone } from '../actions/message.actions';

@Injectable()
export class DeleteMessageEffect {
  constructor(
    private actions$: Actions,
    private service: MessageService
  ) {
  }

  @Effect()
  post$ = this.actions$
    .ofType<DeleteMessage>(DELETE)
    .pipe(
      map(action => action.payload),
      switchMap(payload => this.service.delete(payload)),
      map(() => new DeleteMessageDone())
    );
}
