import { Action } from '@ngrx/store';
import { CurrentSearchModel } from '../../features/search/CurrentSearchModel';


export enum CurrentSearchActionTypes {
    ADD_CURRENT_SEARCH = '[Current Search] Add Current Search',
    REMOVE_CURRENT_SEARCH = '[Current Search] Remove Current Search'
}

export class AddCurrentSearch implements Action {
    readonly type = CurrentSearchActionTypes.ADD_CURRENT_SEARCH;
    constructor(public payload: CurrentSearchModel) {}
}

export class RemoveCurrentSearch implements Action {
    readonly type = CurrentSearchActionTypes.REMOVE_CURRENT_SEARCH;
}

export type All =
    | AddCurrentSearch
    | RemoveCurrentSearch;
