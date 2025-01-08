import {createReducer, on} from '@ngrx/store';
import {loginAction, loginSuccessAction} from './actions';
import {UserModel} from '../../model/user.model';

export interface AuthState {
  loginUser: UserModel | null;
  accessToken: string;
}

export const initialState: AuthState = {
  loginUser: null,
  accessToken: '',
};

export const authReducer = createReducer(
  initialState,
  on(loginAction, (state, {loginUser}) => ({...state, loginUser})),
  on(loginSuccessAction, (state, {accessToken}) => ({...state, accessToken}))
);


