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
    case Actions.SET_ViewContainerRef:
      return {
        ...state,
        viewContainerRef: action.payload
      };
    case Actions.SET_ElementRef:
      return {
        ...state,
        elementRef: action.payload
      };
    case Actions.REG_WX:
      return {
        ...state,
        wx: action.payload
      };
    default:
      return state;
  }
}
