import { Injectable } from '@angular/core';
import { Effect, Actions, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { ProfileDetailsService } from '../../features/profile-details/profile-details.service';
import { defer, Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { AddProfile, GetProfile, ProfileActionTypes } from '../actions/profile.actions';
import { AppState } from '../app.state';

@Injectable()
export class ProfileEffects {


  @Effect()
  GetProfile: Observable<any> = this.actions
  .pipe(
    ofType(ProfileActionTypes.GET_PROFILE),
    // map((action: GetProfile) => action.payload),
    switchMap(payload => {
      return this.profileDetailsService.getProfile()
        .pipe(
          map((profile) => {
            console.log(profile);
            return new AddProfile(profile);
          }))
          // .catch((error) => {
          //   console.log(error);
          //   return Observable.of(new LogInFailure({ error: error }));
          // });
  }))

  @Effect({ dispatch: false })
    AddProfile: Observable<any> = this.actions.pipe(
      ofType(ProfileActionTypes.ADD_PROFILE),
      tap((profile) => {
      })
    );

    @Effect({ dispatch: false })
    RemoveProfile: Observable<any> = this.actions.pipe(
      ofType(ProfileActionTypes.REMOVE_PROFILE),
      tap(() => {
      })
    );

    constructor(
        private actions: Actions,
        private profileDetailsService: ProfileDetailsService
    ) {}
}
