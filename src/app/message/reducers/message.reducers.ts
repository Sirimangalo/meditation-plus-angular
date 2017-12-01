import { Message } from 'app/message/message';
import * as message from '../actions/message.actions';
import * as moment from 'moment';
import * as _ from 'lodash';
import { AppState } from 'app/reducers';
import { createSelector } from '@ngrx/store';

export interface MessageState {
  messages: Message[];
  currentMessage: string;
  noPagesLeft: boolean;
  loadedPage: number;
  usernames: string[];
  loading: boolean;
  initiallyLoaded: boolean;
  posting: boolean;
}

export const initialMessageState: MessageState = {
  messages: [],
  currentMessage: '',
  noPagesLeft: false,
  loadedPage: 0,
  usernames: [],
  loading: false,
  initiallyLoaded: false,
  posting: false
};

export function messageReducer(
  state = initialMessageState,
  action: message.Actions
): MessageState {
  switch (action.type) {
    case message.LOAD: {
      return {
        ..._.cloneDeep(state),
        loading: true
      };
    }
    case message.LOAD_DONE: {
      return loadDone(state, action);
    }

    case message.POST: {
      return {..._.cloneDeep(state), posting: true};
    }

    case message.POST_DONE: {
      return {..._.cloneDeep(state), posting: false, currentMessage: ''};
    }

    case message.SYNC_DONE: {
      const newState = _.cloneDeep(state);
      return {
        ...newState,
        messages: newState.messages.splice(
          action.payload.index,
          0,
          ...action.payload.messages
        ).sort(sortMessages)
      };
    }

    case message.WS_ON_MESSAGE: {
      return {
        ..._.cloneDeep(state),
        messages: [...state.messages, action.payload.current]
          .sort(sortMessages)
      };
    }

    case message.SET_CUR_MESSAGE: {
      return {
        ..._.cloneDeep(state),
        currentMessage: action.payload
      };
    }

    case message.WS_ON_UPDATE:
    case message.UPDATE: {
      return {
        ..._.cloneDeep(state),
        messages: state.messages.map(val => {
          if (val._id === action.payload._id) {
            return action.payload;
          }

          return val;
        })
      };
    }

    default: {
      return state;
    }
  }
}

// Extracted more complex reducer functions

function loadDone(state: MessageState, action: message.LoadMessagesDone): MessageState {
  const messages = state.initiallyLoaded
    ? [...action.payload.messages, ..._.cloneDeep(state.messages)]
    : action.payload.messages;

  const usernames = _.reduce(messages, (set, msg) => {
    const name = (msg.user && msg.user.username) ? msg.user.username : null;
    return name && set.add(name);
  }, new Set());

  return {
    ..._.cloneDeep(state),
    messages,
    loadedPage: action.payload.page,
    noPagesLeft: action.payload.page > 0 && action.payload.messages.length === 0,
    usernames: Array.from(usernames).sort(),
    loading: false,
    initiallyLoaded: true
  };
}

// Helper functions
function sortMessages(a: any, b: any) {
  return moment(a.createdAt).unix() - moment(b.createdAt).unix();
}

// Selectors for easy access
export const selectMessages = (state: AppState) => state.messages;
export const selectMessageList = createSelector(selectMessages, (state: MessageState) => state.messages);
export const selectCurrentMessage = createSelector(selectMessages, (state: MessageState) => state.currentMessage);
export const selectNoPagesLeft = createSelector(selectMessages, (state: MessageState) => state.noPagesLeft);
export const selectLoadedPage = createSelector(selectMessages, (state: MessageState) => state.loadedPage);
export const selectUsernames = createSelector(selectMessages, (state: MessageState) => state.usernames);
export const selectLoading = createSelector(selectMessages, (state: MessageState) => state.loading);
export const selectPosting = createSelector(selectMessages, (state: MessageState) => state.posting);
export const selectInitiallyLoaded = createSelector(selectMessages, (state: MessageState) => state.initiallyLoaded);
