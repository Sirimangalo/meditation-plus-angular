import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';
import { AppState } from 'app/reducers';
import { withLatestFrom, switchMap } from 'rxjs/operators';
import * as moment from 'moment';
import { Message } from 'app/message/message';
import * as _ from 'lodash';
import { WebsocketOnConnect, WS_ON_CONNECT, WebsocketOnConnectPayload, SyncMessages } from 'app/message/actions/message.actions';
import { selectMessageList } from 'app/message/reducers/message.reducers';
import { WebsocketService } from 'app/shared';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

@Injectable()
export class WsOnConnectMessageEffect {
  constructor(
    private actions$: Actions,
    private store$: Store<AppState>,
    private wsService: WebsocketService
  ) {
  }

  @Effect()
  wsReceiveConnect = this.wsService.onConnected()
    .switchMap(data => of(new WebsocketOnConnect(data)));

  @Effect()
  wsOnConnect$ = this.actions$
    .ofType<WebsocketOnConnect>(WS_ON_CONNECT)
    .map(action => action.payload)
    .pipe(
      withLatestFrom(this.store$.select(selectMessageList)),
      switchMap(([payload, messages]) => mapOnConnectToSync(payload, messages))
    );
}

export function mapOnConnectToSync(payload: WebsocketOnConnectPayload, messages: Message[]): Observable<Action> {
  const last = _.last(messages);

  if (!last || moment(last.createdAt).isSame(payload.latestMessage.createdAt)) {
    return of({ type: 'NO_ACTION' });
  }

  return of(new SyncMessages({
    index: messages.length - 1,
    from: last.createdAt,
    to: moment(payload.latestMessage.createdAt)
  }));
}
