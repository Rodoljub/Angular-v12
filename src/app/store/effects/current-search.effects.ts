import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { CurrentSearchModel } from '../../features/search/CurrentSearchModel';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CurrentSearchActionTypes } from '../actions/current-search.actions';
import { AppState } from '../app.state';

@Injectable()
export class CurrentSearchEffects {

    @Effect({ dispatch: false })
    AddCurrentSearch: Observable<any> = this.actions.pipe(
        ofType(CurrentSearchActionTypes.ADD_CURRENT_SEARCH),
        tap((currentSearch) => {
            // if (!!localStorage) {
            //     let state = localStorage.getItem('state');
            //     if (state) {
            //         let stateParse: AppState = JSON.parse(state);
            //         stateParse.currentSearch = currentSearch.payload;
            //         localStorage.setItem('state', JSON.stringify(stateParse));
            //     }
            // }
        })
    )

    @Effect({ dispatch: false })
    RemoveCurrentSearch: Observable<any> = this.actions.pipe(
        ofType(CurrentSearchActionTypes.REMOVE_CURRENT_SEARCH),
        tap(() => {
            // if (!!localStorage) {
            //     let state = localStorage.getItem('state');
            //     if (state) {
            //         let stateParse: AppState = JSON.parse(state);
            //         // stateParse.currentSearch = null;
            //         stateParse.currentSearch = new CurrentSearchModel('', []);
            //         localStorage.setItem('state', JSON.stringify(stateParse));
            //     }
            // }
        })
    )

    constructor(
        private actions: Actions
    ) {}
}
