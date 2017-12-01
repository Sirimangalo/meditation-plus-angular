import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { AutocompleteUser, AUTOCOMPLETE_USER, SetCurrentMessage } from 'app/message/actions/message.actions';
import { map, withLatestFrom, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { Action, Store } from '@ngrx/store';
import { AppState } from 'app/reducers';
import { selectUsernames, selectCurrentMessage } from 'app/message/reducers/message.reducers';
import { of } from 'rxjs/observable/of';
import { UserService } from 'app/user';

@Injectable()
export class AutocompleteMessageEffect {
  constructor(
    private actions$: Actions,
    private store$: Store<AppState>,
    private userService: UserService
  ) {
  }

  @Effect()
  $autocomplete = this.actions$
    .ofType<AutocompleteUser>(AUTOCOMPLETE_USER)
    .pipe(
      map(action => action.payload),
      withLatestFrom(
        this.store$.select(selectUsernames),
        this.store$.select(selectCurrentMessage)
      ),
      switchMap(([caretPos, usernames, curMsg]) =>
        mapAutocompleteToAction(caretPos, usernames, curMsg, this.userService)
      )
    );
}

export function mapAutocompleteToAction(
  caretPos: number,
  usernames: string[],
  curMsg: string,
  userService: UserService
): Observable<Action> {

  const textBfCaret = curMsg.substring(0, caretPos);
  const search = textBfCaret.match(/@\w+$/g);

  if (!search || search.length === 0) {
    return of({ type: 'NO_ACTION' });
  }

  const matches = usernames
  .filter(name => new RegExp('^' + search[0].substring(1), 'i').test(name));

  if (matches.length > 0) {
    return of(createAutocompletePayload(
      caretPos, curMsg, textBfCaret,
      search, matches[0]
    ));
  } else {
    return userService.getUsername(search[0].substring(1))
      .map(res => res.json())
      .filter(res => res.length > 0)
      .map(username => createAutocompletePayload(
        caretPos, curMsg, textBfCaret,
        search, username
      ));
  }
}

export function createAutocompletePayload(
  caretPos: number,
  curMsg: string,
  textBfCaret: string,
  search: any[],
  username: string
): SetCurrentMessage {
  textBfCaret = textBfCaret.slice(0, 1 - search[0].length) + username + ' ';
  const payload = textBfCaret + curMsg.substring(caretPos);
  return new SetCurrentMessage(payload);
}
