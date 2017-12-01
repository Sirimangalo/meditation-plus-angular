import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { MessageService } from 'app/message/message.service';
import { WebsocketOnUpdateMessage } from 'app/message/actions/message.actions';
import { of } from 'rxjs/observable/of';

@Injectable()
export class WsOnUpdateMessageEffect {
  constructor(
    private service: MessageService
  ) {
  }

  @Effect()
  wsOnConnect$ = this.service.getUpdateSocket()
    .switchMap(data => of(new WebsocketOnUpdateMessage(data.populated)));
}
