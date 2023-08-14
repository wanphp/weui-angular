import {Action} from '@ngrx/store';

export const ACCESS_TOKEN = 'ACCESS_TOKEN';
export const CURRENT_USER = 'CURRENT_USER';

export class currentUser implements Action {
  readonly type: string = CURRENT_USER;

  constructor(public payload: any) {
  }
}

export class accessToken implements Action {
  readonly type: string = ACCESS_TOKEN;

  constructor(public payload?: string) {
  }
}

export type AuthAction = currentUser | accessToken;
