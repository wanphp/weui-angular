import {Action} from '@ngrx/store';

export const SET_THEME: string = 'SET_THEME';
export const SET_NAVBAR: string = 'SET_NAVBAR';
export const SET_NAVBAR_MORE: string = 'SET_NAVBAR_MORE';

export class SetTheme implements Action {
  readonly type: string = SET_THEME;

  constructor(public payload?: any) {
  }
}

export class SetNavbar implements Action {
  readonly type: string = SET_NAVBAR;

  constructor(public payload: any) {
  }
}

export class SetNavbarMore implements Action {
  readonly type: string = SET_NAVBAR_MORE;

  constructor(public payload: any) {
  }
}

export type UiAction =
  | SetTheme
  | SetNavbar
  | SetNavbarMore;
