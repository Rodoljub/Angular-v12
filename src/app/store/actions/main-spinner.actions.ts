import { Action } from '@ngrx/store';

export enum MainSpinnerActionTypes {
    SET_MAIN_SPINNER = '[Main Spinner] Set Main Spinner'
}

export class SetMainSpinner implements Action {
    readonly type = MainSpinnerActionTypes.SET_MAIN_SPINNER;
    constructor(public payload: boolean) {}
}

export type All =
    | SetMainSpinner;
