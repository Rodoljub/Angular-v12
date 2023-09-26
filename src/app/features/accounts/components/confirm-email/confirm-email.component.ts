import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { BaseAccountsComponent } from '../base-accounts/base-accounts.component';
import { CommonResponseService } from '../../../../services/utility/common-response.service';
import { EventService } from '../../../../services/utility/event.service';
import { AccountsEventsService } from '../../accounts-events.service';
import { MappingItem } from '../../../../shared/mappingItem';
import { isPlatformBrowser } from '@angular/common';
import { SnackBarService } from '../../../common/snack-bar/snack-bar.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html'
})

export class ConfirmEmailComponent extends BaseAccountsComponent implements OnInit, OnDestroy {
  success
  returnUrl: string;
  _route: ActivatedRoute;
  _router: Router;

  constructor(
    route: ActivatedRoute,
    router: Router,
    private userService: UserService,
    private commonResponseService: CommonResponseService,
    private eventService: EventService,
    private snackBarService: SnackBarService,
    accountsEventsService: AccountsEventsService,
    titleService: Title,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    super(accountsEventsService, titleService, route, router)

    this._route = route;
    this._router = router;

  }


  ngOnInit() {

    if (isPlatformBrowser(this.platformId)) {
      super.accountSetTitle('Confirmation Email')

      this._route.queryParams.subscribe((params: Params) => {

        let confirmUrl = params['confirmurl'] as string;

        this.returnUrl = params['returnUrl'] as string;

        if (confirmUrl === undefined || confirmUrl === null) {

          this._router.navigate(['/404']);

        } else {

          this.userService.confirmEmail(confirmUrl)
            .then(returnUrl => {
              this.returnUrl = returnUrl;
              super.acoountAnimationIn();
              this._router.navigate([{outlets: {auth: 'accounts/login'}}]);


            })
            .catch(respError => this.respError(respError))
        }
      })
    }
  }

  ngOnDestroy() {

  }

  private respError(respError: any) {
    let errorMapping: Array<MappingItem> = [
      new MappingItem('DuplicateUserName', 'ErrorClassName'),
      new MappingItem('DuplicateEmail', 'ErrorClassEmail'),
    ];
    // this.commonResponseService.dispalyErrorMessages(respError, this, errorMapping);
    super.acoountAnimationIn();
    return respError;
  }
}
