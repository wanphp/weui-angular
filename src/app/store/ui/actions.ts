import {Action} from '@ngrx/store';

export const SET_THEME: string = 'SET_THEME';
export const SET_NAVBAR: string = 'SET_NAVBAR';
export const SET_NAVBAR_MORE: string = 'SET_NAVBAR_MORE';
export const SET_ViewContainerRef: string = 'SET_ViewContainerRef';
export const SET_ElementRef: string = 'SET_ElementRef';
export const REG_WX: string = 'REG_WX';

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

export class SetViewContainerRef implements Action {
  readonly type: string = SET_ViewContainerRef;

  constructor(public payload: any) {
  }
}

export class SetElementRef implements Action {
  readonly type: string = SET_ElementRef;

  constructor(public payload: any) {
  }
}

export class RegWx implements Action {
  readonly type: string = REG_WX;

  constructor(public payload: any) {
  }
}

export type UiAction =
  | SetTheme
  | SetNavbar
  | SetNavbarMore;
