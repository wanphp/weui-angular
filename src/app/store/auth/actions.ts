import {createAction, props} from '@ngrx/store';
import {UserModel} from '../../model/user.model';

export const loginAction = createAction(
  '[Auth] Login',
  props<{ loginUser: UserModel }>()
);
export const loginSuccessAction = createAction(
  '[Auth] Login Success',
  props<{ accessToken: string }>()
);
