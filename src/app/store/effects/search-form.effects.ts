import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { SearchFormModel } from '../../features/search/SearchFormModel';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SearchFormActionTypes } from '../actions/search-form.actions';
import { AppState } from '../app.state';



@Injectable()
export class SearchFormEffects {

    @Effect({ dispatch: false })
    AddSearchForm: Observable<any> = this.actions.pipe(
        ofType(SearchFormActionTypes.ADD_SEARCH_FORM),
        tap((searchForm) => {
        })
    )

    @Effect({ dispatch: false })
    RemoveSearchForm: Observable<any> = this.actions.pipe(
        ofType(SearchFormActionTypes.REMOVE_SEARCH_FORM),
        tap(() => {
        })
    )

    @Effect({ dispatch: false })
    ChangeSearchFormOpen: Observable<any> = this.actions.pipe(
        ofType(SearchFormActionTypes.CHANGE_SEARCH_FORM_OPEN),
        tap(open => {
        })
    )

    @Effect({ dispatch: false })
    ChangeInputChars: Observable<any> = this.actions.pipe(
        ofType(SearchFormActionTypes.CHANGE_INPUT_CHARS),
        tap((chars) => {
        })
    )

    @Effect({ dispatch: false })
    AddSelectedTag: Observable<any> = this.actions.pipe(
        ofType(SearchFormActionTypes.ADD_SELECTED_TAG),
        tap((selectedTag) => {
        })
    )

    @Effect({ dispatch: false })
    AddSelectedTags: Observable<any> = this.actions.pipe(
        ofType(SearchFormActionTypes.ADD_SELECTED_TAGS),
        tap((selectedTags) => {
        })
    )

    @Effect({ dispatch: false })
    RemoveSelectedTag: Observable<any> = this.actions.pipe(
        ofType(SearchFormActionTypes.REMOVE_SELECTED_TAG),
        tap((removedTag) => {
        })
    )

    @Effect({ dispatch: false })
    ChangeSearch: Observable<any> = this.actions.pipe(
        ofType(SearchFormActionTypes.CHANGE_SEARCH),
        tap((search) => {
        })
    )

    constructor(
        private actions: Actions
    ) {}
}
