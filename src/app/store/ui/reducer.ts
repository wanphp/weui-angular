import * as Actions from './actions';
import {UiAction} from './actions';
import initialState, {UiState} from './state';

export function uiReducer(state: UiState = initialState, action: UiAction) {
  switch (action.type) {
    case Actions.SET_THEME:
      return {
        ...state,
        theme: action.payload
      };
    case Actions.SET_NAVBAR:
      return {
        ...state,
        navbar: action.payload
      };
    case Actions.SET_NAVBAR_MORE:
      return {
        ...state,
        navbarMore: action.payload
      };
    default:
      return state;
  }
}
