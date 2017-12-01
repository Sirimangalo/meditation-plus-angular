import { Action } from '@ngrx/store';
import { Message } from 'app/message/message';
import { Moment } from 'moment';

export const LOAD = '[Message] Load';
export const LOAD_DONE = '[Message] Load Done';
export const POST = '[Message] Post';
export const POST_DONE = '[Message] Post Done';
export const EDIT = '[Message] Edit';
export const EDIT_DONE = '[Message] Edit Done';
export const DELETE = '[Message] Delete';
export const DELETE_DONE = '[Message] Delete Done';
export const SYNC = '[Message] Sync';
export const SYNC_DONE = '[Message] Sync Done';
export const WS_ON_MESSAGE = '[Message] WS On Message';
export const WS_ON_CONNECT = '[Message] WS On Connect';
export const WS_ON_UPDATE = '[Message] WS On Update';
export const AUTOCOMPLETE_USER = '[Message] Autocomplete User';
export const SET_CUR_MESSAGE = '[Message] Set Current';
export const UPDATE = '[Message] Update';

export class LoadMessages implements Action {
  readonly type = LOAD;
  constructor(public payload: number) {}
}

export class LoadMessagesDone implements Action {
  readonly type = LOAD_DONE;
  constructor(public payload: {messages: Message[], page: number}) {}
}

export class PostMessage implements Action {
  readonly type = POST;
}

export class PostMessageDone implements Action {
  readonly type = POST_DONE;
}

export class EditMessage implements Action {
  readonly type = EDIT;
  constructor(public payload: Message) {}
}

export class EditMessageDone implements Action {
  readonly type = EDIT_DONE;
}

export class DeleteMessage implements Action {
  readonly type = DELETE;
  constructor(public payload: Message) {}
}

export class DeleteMessageDone implements Action {
  readonly type = DELETE_DONE;
}

export class SyncMessages implements Action {
  readonly type = SYNC;
  constructor(public payload: {index: number, from: Date, to: Moment}) {}
}

export class SyncMessagesDone implements Action {
  readonly type = SYNC_DONE;
  constructor(public payload: { index: number, messages: Message[]}) {}
}

export interface WebsocketOnMessagePayload {
  previous: Message;
  current: Message;
}
export class WebsocketOnMessage implements Action {
  readonly type = WS_ON_MESSAGE;
  constructor(public payload: WebsocketOnMessagePayload) {}
}

export interface WebsocketOnConnectPayload {
  latestMessage: Message;
}
export class WebsocketOnConnect implements Action {
  readonly type = WS_ON_CONNECT;
  constructor(public payload: WebsocketOnConnectPayload) {}
}

export class AutocompleteUser implements Action {
  readonly type = AUTOCOMPLETE_USER;
  constructor(public payload: number) {}
}

export class SetCurrentMessage implements Action {
  readonly type = SET_CUR_MESSAGE;
  constructor(public payload: string) {}
}

export class UpdateMessage implements Action {
  readonly type = UPDATE;
  constructor(public payload: Message) {}
}

export class WebsocketOnUpdateMessage implements Action {
  readonly type = WS_ON_UPDATE;
  constructor(public payload: Message) {}
}

export type Actions = LoadMessages
 | LoadMessagesDone
 | PostMessage
 | PostMessageDone
 | EditMessage
 | EditMessageDone
 | DeleteMessage
 | DeleteMessageDone
 | SyncMessages
 | SyncMessagesDone
 | WebsocketOnMessage
 | WebsocketOnConnect
 | WebsocketOnUpdateMessage
 | AutocompleteUser
 | SetCurrentMessage
 | UpdateMessage
;
