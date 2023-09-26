import { Injectable } from '@angular/core';
import { Effect, Actions, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { ProfileDetailsService } from '../../features/profile-details/profile-details.service';
import { defer, Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AppState } from '../app.state';
import { AddSavedSearch, AddSavedSearches, GetSavedSearches, RemoveSavedSearch, SavedSearchesActionTypes,
   UpdateSavedSearch } from '../actions/saved-searches.actions';
import { SearchApiService } from '../../services/rs/search-api.service';
import { SnackBarService } from '../../features/common/snack-bar/snack-bar.service';
import { Router } from '@angular/router';

@Injectable()
export class SavedSearchesEffects {


  @Effect()
  GetSavedSearches: Observable<any> = this.actions
  .pipe(
    ofType(SavedSearchesActionTypes.GET_SAVED_SEARCHES),
    // map((action: GetProfile) => action.payload),
    switchMap(payload => {
      return this.searchApiService.getSavedSearch()
        .pipe(
          map((savedSearches) => {
            return new AddSavedSearches(savedSearches);
          }))
          // .catch((error) => {
          //   console.log(error);
          //   return Observable.of(new LogInFailure({ error: error }));
          // });
  }))

  @Effect({ dispatch: false })
  AddSavedSearches: Observable<any> = this.actions.pipe(
    ofType(SavedSearchesActionTypes.ADD_SAVED_SEARCHES),
    tap()
  );

  @Effect({ dispatch: false })
  RemoveSavedSearches: Observable<any> = this.actions.pipe(
    ofType(SavedSearchesActionTypes.REMOVE_SAVED_SEARCHES),
    tap()
  );

  @Effect()
  AddSavedSearch: Observable<any> = this.actions.pipe(
    ofType(SavedSearchesActionTypes.ADD_SAVED_SEARCH),
    map((action: AddSavedSearch) => action.payload),
    switchMap(payload => {
      return this.searchApiService.saveSearch(payload)
        .pipe(
          map(() => {
            this.snackBarService.popMessageSuccess('Search is saved');
            return new GetSavedSearches();
          }),
          catchError(err => {
            this.snackBarService.popMessageError('Search is not saved');
            return of([err]);
          })
        )

      })
  )

  @Effect()
  UpdateSavedSearch: Observable<any> = this.actions.pipe(
    ofType(SavedSearchesActionTypes.UPDATE_SAVED_SEARCH),
    map((action: UpdateSavedSearch) => action.payload),
    switchMap(payload => {
      return this.searchApiService.updateSearch(payload)
        .pipe(
          map(() => {
            this.snackBarService.popMessageSuccess('Search is updated');
            return new GetSavedSearches();
          }))
      })
  )

  @Effect()
  RemoveSavedSearch: Observable<any> = this.actions.pipe(
    ofType(SavedSearchesActionTypes.REMOVE_SAVED_SEARCH),
    map((action: RemoveSavedSearch) => action.payload),
    switchMap(payload => {
      return this.searchApiService.deleteSavedSearchResults([].concat(payload))
        .pipe(
          map(() => {
            this.snackBarService.popMessageSuccess('Delete Successful');
            return new GetSavedSearches();
          }),
          catchError(err => {

            this.snackBarService.popMessageError('Search is not deleted');
            return of([err]);
          })
        )
      })
  )

  constructor(
      private actions: Actions,
      private searchApiService: SearchApiService,
      private snackBarService: SnackBarService,
      private router: Router
  ) {}
}
