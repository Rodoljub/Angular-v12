import { Component, OnInit, AfterViewInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { Params, Route, ActivatedRoute, Router, CanActivate } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { CommonResponseService } from '../../../../services/utility/common-response.service';
import { BaseAccountsComponent } from '../base-accounts/base-accounts.component';
import { FormErrorStateMatcher } from '../../../common/FormErrorStateMatcher';
import { EventService } from '../../../../services/utility/event.service';
import { AccountsEventsService } from '../../accounts-events.service';
import { MappingItem } from '../../../../shared/mappingItem';
import { isPlatformBrowser } from '@angular/common';
import { SnackBarService } from '../../../common/snack-bar/snack-bar.service';
import { NewPasswordModel } from '../../models/NewPasswordModel';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styles: [],
  providers: [
    CommonResponseService
  ]
})
export class ResetPasswordComponent extends BaseAccountsComponent implements OnInit, AfterViewInit, OnDestroy {

  resetPasswordForm: FormGroup
  countDown = 5;
  success = false;
  formErrorStateMatcher = new FormErrorStateMatcher();

  _route: ActivatedRoute;
  _router: Router

  constructor(
    route: ActivatedRoute,
    router: Router,
    private userService: UserService,
     titleService: Title,
    private commonResponseService: CommonResponseService,
    private snackBarService: SnackBarService,
    private eventService: EventService,
    private formBuilder: FormBuilder,
    accountsEventsService: AccountsEventsService,
    @Inject(PLATFORM_ID) private platformId: Object
    ) {
    super(
      accountsEventsService,
      titleService,
      route,
      router
    );

    this._route = route;
    this._router = router;
    this.createForm();
    }



  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {

    window.scrollTo(0, 0);
    super.accountSetTitle('Reset Password')
    super.acoountAnimationIn();
    this._route.queryParams.subscribe((params: Params) => {
        let reseturl = params['reseturl'] as string;
        if (reseturl === undefined || reseturl == null) {
          this._router.navigate(['/404']);
        } else {
          setTimeout(() => {
            document.getElementsByName('password')[0].focus();
          }, 1000)
        }
      })
    }
  }

  ngAfterViewInit(): void {

  }

  ngOnDestroy() {
  }

  createForm() {
    this.resetPasswordForm = this.formBuilder.group({
      'passwordControl': [
        '',
        [
           Validators.required,
           Validators.minLength(6)
        ]
      ],
      'confirmPasswordControl': ['', Validators.required]
    }, {validator: this.passwordConfirming})
  }

  get formControls() {
    this.passwordControl = this.resetPasswordForm.get('passwordControl');
    this.confirmPasswordControl = this.resetPasswordForm.get('confirmPasswordControl');

    super.baseFormControl();

    return this.passwordControl || this.confirmPasswordControl;

  }

  passwordConfirming(c: AbstractControl): { invalid: boolean } {
    let passValue = c.get('passwordControl').value
    let confpassValue = c.get('confirmPasswordControl').value
    // if (confpassValue === '') {
    //   c.get('confirmPasswordControl').setErrors({'required': true})
    //   return {invalid: true}
    // }
    if (passValue !== confpassValue) {
      c.get('confirmPasswordControl').setErrors({'mismatch': true})
      return {invalid: true};
    }
  }

  resetPassword(event) {
    super.acoountAnimationOut();
    this._route.queryParams.subscribe((params: Params) => {

      let reseturl = params['reseturl'] as string;

      if (reseturl === undefined || reseturl == null) {
        this._router.navigate(['/404']);

      }

      let newPassword = new NewPasswordModel(
        this.resetPasswordForm.get('passwordControl').value,
        this.resetPasswordForm.get('confirmPasswordControl').value
      );

      let newPassResult = this.userService.resetPassword(newPassword, reseturl)
        .then(resp => {
          this.success = true;
         /* this.SnackBarService.popMessageSuccess("Your password has been reset successfully"); */

          super.acoountAnimationIn();
          this.countDownAndRedirect();

        })
        .catch(respError => {

          let errorMapping: Array<MappingItem> =
            [

            ];
          super.acoountAnimationIn();
          this.success = false;

          // this.commonResponseService.dispalyErrorMessages(respError, this, errorMapping);
          return respError;
        });
    })
  }

  countDownAndRedirect() {

    let countdownInterval = setInterval(() => {

      if (this.countDown > 0) {

        this.countDown = this.countDown - 1;
      } else {
        clearInterval(countdownInterval);
        this.navigateToAccountsRoutes('login', '', 'focus');
      }

    }, 1000);
  }

  formKeyupEnter(event) {
    if (event.target.id === 'confirmPasswordControl' && this.resetPasswordForm.valid) {
      return true;
    } else {
      return false;
    }
  }
}
