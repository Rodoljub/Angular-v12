import { Action } from '@ngrx/store';
import { SearchFormModel } from '../../features/search/SearchFormModel';


export enum SearchFormActionTypes {
    ADD_SEARCH_FORM = '[Search Form] Add Search Form',
    REMOVE_SEARCH_FORM = '[Search Form] Remove Search Form',

    CHANGE_SEARCH_FORM_OPEN = '[Search Form] Change Search Form Open',
    CHANGE_INPUT_CHARS = '[Search Form] Add Input Chars',
    ADD_SELECTED_TAG = '[Search Form] Add Selected Tag',
    ADD_SELECTED_TAGS = '[Search Form] Add Selected Tags',
    REMOVE_SELECTED_TAG = '[Search Form] Remove Selected Tag',
    CHANGE_SEARCH = '[Search Form] Change Selected Tag'
}

export class AddSearchForm implements Action {
    readonly type = SearchFormActionTypes.ADD_SEARCH_FORM;
    constructor(public payload: SearchFormModel) {}
}

export class RemoveSearchForm implements Action {
    readonly type = SearchFormActionTypes.REMOVE_SEARCH_FORM;
}


export class ChangeSearchFormOpen implements Action {
    readonly type = SearchFormActionTypes.CHANGE_SEARCH_FORM_OPEN;
    constructor(public payload: boolean) {}
}

export class ChangeInputChars implements Action {
    readonly type = SearchFormActionTypes.CHANGE_INPUT_CHARS;
    constructor(public payload: string) {}
}

export class AddSelectedTag implements Action {
    readonly type = SearchFormActionTypes.ADD_SELECTED_TAG;
    constructor(public payload: string) {}
}

export class AddSelectedTags implements Action {
    readonly type = SearchFormActionTypes.ADD_SELECTED_TAGS;
    constructor(public payload: string[] = []) {}
}

export class RemoveSelectedTag implements Action {
    readonly type = SearchFormActionTypes.REMOVE_SELECTED_TAG;
    constructor(public payload: string) {}
}

export class ChangeSearch implements Action {
    readonly type = SearchFormActionTypes.CHANGE_SEARCH;
    constructor(public payload: boolean) {}
}

export type All =
    | AddSearchForm
    | RemoveSearchForm
    | ChangeSearchFormOpen
    | ChangeInputChars
    | AddSelectedTag
    | AddSelectedTags
    | RemoveSelectedTag
    | ChangeSearch;


