import * as Actions from './actions';
import {AuthAction} from './actions';
import initialState, {AuthState} from './state';

export function authReducer(state: AuthState = initialState, action: AuthAction) {
  switch (action.type) {
    case Actions.ACCESS_TOKEN:
      return {
        ...state,
        token: action.payload
      };
    case Actions.CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload
      };
    default:
      return state;
  }
}
