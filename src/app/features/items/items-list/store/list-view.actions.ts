import { Action } from "@ngrx/store";

export enum ListViewActionTypes {
    CHANGE_LIST_VIEW_STATE = '[ListView] Change List View State'
}

export class ChangeListViewState implements Action {
    readonly type = ListViewActionTypes.CHANGE_LIST_VIEW_STATE;
    constructor(public viewType: string) {};
}

export type AllListViewActions =
    | ChangeListViewState;