import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProgressSpinnerModel } from '../../../../features/common/progress-loaders/progress-spinner/ProgressSpinnerModel';
import { EventService } from '../../../../services/utility/event.service';
import { OidcService } from '../../services/oidc.service';

@Component({
  selector: 'app-signout-redirect-callback',
  template: `<div></div>`
})
export class SignoutRedirectCallbackComponent implements OnInit {

  constructor(private _oidcService: OidcService, private _router: Router,
    private eventService: EventService) { }

  ngOnInit(): void {
    let progressSpinnerModel = new ProgressSpinnerModel(true, true);
    this.eventService.setMainProgressSpinner(progressSpinnerModel);
    this._oidcService.finishLogout()
    .then(_ => {
      let progressSpinnerModel1 = new ProgressSpinnerModel(false, false);
      this.eventService.setMainProgressSpinner(progressSpinnerModel1);
      this._router.navigate(['/'], { replaceUrl: true });
    })
    .catch(err => {
      let progressSpinnerModel1 = new ProgressSpinnerModel(false, false);
      this.eventService.setMainProgressSpinner(progressSpinnerModel1);
    })
  }

}
