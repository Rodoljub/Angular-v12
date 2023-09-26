import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { SaveSearchResultModel } from '../../../../features/search/SaveSearchResultModel';
import { AppState, selectSavedSearchesState } from '../../../../store/app.state';
import { Observable, Subscription } from 'rxjs';
import { config } from '../../../../../config/config';
import { OidcService } from '../../services/oidc.service';
import { ProgressSpinnerModel } from '../../../../features/common/progress-loaders/progress-spinner/ProgressSpinnerModel';
import { EventService } from '../../../../services/utility/event.service';

@Component({
  selector: 'app-signin-redirect-callback',
  template: `<div></div>`
})
export class SigninRedirectCallbackComponent implements OnInit, OnDestroy {

  getSavedSearchesState: Observable<SaveSearchResultModel[]>;
  saveSearchResults: SaveSearchResultModel[] = [];
  getSavedSearchesStateSub: Subscription;

  constructor(
    private store: Store<AppState>,
    private _oidcService: OidcService,
    private _router: Router,
    private route: ActivatedRoute,
    private eventService: EventService
  ) {
    this.getSavedSearchesState = this.store.select(selectSavedSearchesState);


  }

  ngOnInit(): void {
    let progressSpinnerModel = new ProgressSpinnerModel(true, true);
    this.eventService.setMainProgressSpinner(progressSpinnerModel);
    let route = this.route.url;
    const iframe = document.getElementById('iframe')
    this._oidcService.finishLogin()
    .then(resp => {
      console.log(resp)
      let progressSpinnerModel1 = new ProgressSpinnerModel(false, false);
      this.eventService.setMainProgressSpinner(progressSpinnerModel1);

      this.getSavedSearchesStateSub = this.getSavedSearchesState.subscribe((savedSearches) => {
        this.saveSearchResults = savedSearches;
  
        if (savedSearches !== null) {
          this._router.navigate(['/'], { replaceUrl: true });
        }
      });
      // this._router.navigate(['/'], { replaceUrl: true });
    })
    .catch(_ => {
      let progressSpinnerModel1 = new ProgressSpinnerModel(false, false);
      this.eventService.setMainProgressSpinner(progressSpinnerModel1);
      this._router.navigate(['/'], { replaceUrl: true });
    })

  }

  ngOnDestroy(): void {
      if (this.getSavedSearchesStateSub) {
        this.getSavedSearchesStateSub.unsubscribe();
      }
  }
}
