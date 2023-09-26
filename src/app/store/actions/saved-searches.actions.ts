import { Action } from '@ngrx/store';
import { SaveSearchModel } from '../../features/search/SaveSearchModel';
import { SaveSearchResultModel } from '../../features/search/SaveSearchResultModel';

export enum SavedSearchesActionTypes {
    GET_SAVED_SEARCHES = '[Saved Searches] Get Saved Searches',
    ADD_SAVED_SEARCHES = '[Saved Searches] Add Saved Searches',
    REMOVE_SAVED_SEARCHES = '[Saved Searches] Remove Saved Searches',
    ADD_SAVED_SEARCH = '[Saved Searches] Add Saved Search',
    UPDATE_SAVED_SEARCH = '[Saved Searches] Update Saved Search',
    REMOVE_SAVED_SEARCH = '[Saved Searches] Remove Saved Search'
}

export class GetSavedSearches implements Action {
    readonly type = SavedSearchesActionTypes.GET_SAVED_SEARCHES;
    constructor() {}
}

export class AddSavedSearches implements Action {
    readonly type = SavedSearchesActionTypes.ADD_SAVED_SEARCHES;
    constructor(public payload: SaveSearchResultModel[]) {}
}

export class RemoveSavedSearches implements Action {
    readonly type = SavedSearchesActionTypes.REMOVE_SAVED_SEARCHES;
    constructor(public payload: any) {}
}

export class AddSavedSearch implements Action {
    readonly type = SavedSearchesActionTypes.ADD_SAVED_SEARCH;
    constructor(public payload: SaveSearchModel) {}
}

export class UpdateSavedSearch implements Action {
    readonly type = SavedSearchesActionTypes.UPDATE_SAVED_SEARCH;
    constructor(public payload: SaveSearchResultModel) {}
}

export class RemoveSavedSearch implements Action {
    readonly type = SavedSearchesActionTypes.REMOVE_SAVED_SEARCH;
    constructor(public payload: string) {}
}

  export type All =
    | GetSavedSearches
    | AddSavedSearches
    | RemoveSavedSearches
    | AddSavedSearch
    | UpdateSavedSearch
    | RemoveSavedSearch;
