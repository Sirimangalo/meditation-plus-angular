import { Injectable, EventEmitter } from '@angular/core';
declare var cordova: any;

// tslint:disable-next-line
export type InternalStateType = {
  [key: string]: any
};

@Injectable()
export class AppState {
  _state: InternalStateType = { };

  public stateChange: EventEmitter<any> = new EventEmitter<any>();
  public IS_CORDOVA = typeof cordova !== 'undefined';

  // already return a clone of the current state
  public get state() {
    return this._state = this._clone(this._state);
  }
  // never allow mutation
  public set state(value) {
    throw new Error('do not mutate the `.state` directly');
  }


  public get(prop?: any) {
    // use our state getter for the clone
    const state = this.state;
    return state.hashOwnProperty(prop) ? state[prop] : state;
  }

  public set(prop: string, value: any) {
    // internally mutate our state
    this._state[prop] = value;
    this.stateChange.emit(this._state);
    return this._state;
  }


  public _clone(object) {
    // simple object clone
    return JSON.parse(JSON.stringify( object ));
  }
}
