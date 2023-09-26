import { All, MainSpinnerActionTypes } from '../actions/main-spinner.actions';



export const initialState = false;

export function reducer(state = initialState, action: All): boolean {

    switch (action.type) {
        case MainSpinnerActionTypes.SET_MAIN_SPINNER:
            return action.payload;
        default:
            return state;
    }
}
