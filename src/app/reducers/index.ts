import {
  ActionReducerMap, MetaReducer
} from '@ngrx/store';
import { MessageState, messageReducer } from 'app/message/reducers/message.reducers';
import { environment } from 'environments/environment';
import { storeFreeze } from 'ngrx-store-freeze';

export interface AppState {
  messages: MessageState;
}

export const appReducers: ActionReducerMap<AppState> = {
  messages: messageReducer
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [storeFreeze] : [];
