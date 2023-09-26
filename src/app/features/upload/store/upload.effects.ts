import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { ItemService } from '../../../services/rs/item.service';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AddAnalyzingImages, UploadActionTypes } from './upload.actions';

@Injectable()
export class UploadEffects {


    @Effect()
    GetAnalyzingImages: Observable<any> = this.actions.pipe(
        ofType(UploadActionTypes.GET_ANALYZING_IMAGES),
        switchMap(payload => {
            return this.itemService.getAnayzingImages()
              .pipe(
                map((analyzingImages) => {
                  return new AddAnalyzingImages(analyzingImages);
                }))
                // .catch((error) => {
                //   console.log(error);
                //   return Observable.of(new LogInFailure({ error: error }));
                // });
        })
        // tap((searchForm) => {
        // })
    )

    constructor(
        private actions: Actions,
        private itemService: ItemService
    ) {}
}
