import {UiState} from './ui/state';
import {AuthState} from "@/store/auth/state";

export interface AppState {
  auth: AuthState;
  ui: UiState;
}
