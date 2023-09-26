import { Action, ActionReducer, INIT, UPDATE } from '@ngrx/store';
import { All, HydrateSuccess, HydrationActionTypes } from '../actions/hydration.actions';
import { AppState } from '../app.state';

export function hydrationMetaReducer(
  reducer: ActionReducer<AppState>
): ActionReducer<AppState> {
  return (state, action) => {
    if (!!window.localStorage) {
      if (action.type === INIT || action.type === UPDATE) {
        const storageValue = localStorage.getItem('state');
        if (storageValue) {
          try {
            return JSON.parse(storageValue);
          } catch {
            localStorage.removeItem('state');
          }
        }
      }
      const nextState = reducer(state, action);
      localStorage.setItem('state', JSON.stringify(nextState));
      return nextState;
    }
  };
};



