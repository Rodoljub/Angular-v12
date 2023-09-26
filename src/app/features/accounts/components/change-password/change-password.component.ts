import { Component, OnInit, AfterViewInit,
  ViewChild, ElementRef, ChangeDetectorRef, OnDestroy, Inject, PLATFORM_ID, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';

import { CommonResponseService } from '../../../../services/utility/common-response.service';
import { BaseAccountsComponent } from '../base-accounts/base-accounts.component';
import { FormErrorStateMatcher } from '../../../common/FormErrorStateMatcher';
import { EventService } from '../../../../services/utility/event.service';
import { AccountsEventsService } from '../../accounts-events.service';
import { isPlatformBrowser } from '@angular/common';
import { SnackBarService } from '../../../common/snack-bar/snack-bar.service';
import { ChangePasswordModel } from '../../models/ChangePasswordModel';
import { MappingItem } from '../../../../shared/mappingItem';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  providers: [
    CommonResponseService
  ]
})
export class ChangePasswordComponent extends BaseAccountsComponent implements OnInit, AfterViewInit, OnDestroy {

  changePasswordForm: FormGroup;
  countDown = 5;
  success = false;
  confirmError = false;
  clickOnButton = false;
  contentStateSubscription: Subscription
  _router: Router;

  @ViewChild('passwordInput', {static: false}) passwordInput: ElementRef

  formErrorStateMatcher = new FormErrorStateMatcher();

  constructor(
    route: ActivatedRoute,
    router: Router,
    private userService: UserService,
    private commonResponseService: CommonResponseService,
    private snackBarService: SnackBarService,
    private renderer: Renderer2,
    private eventService: EventService,
    titleService: Title,
    accountsEventsService: AccountsEventsService,
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    super(
      accountsEventsService,
      titleService,
      route,
      router
    )
    this._router = router;
  }


  ngOnInit() {

    if (isPlatformBrowser(this.platformId)) {

      super.accountSetTitle('Change Password')

      super.acoountAnimationIn();
      this.createForm();
      setTimeout(() => {
        this.renderer.selectRootElement(this.passwordInput.nativeElement).focus();
      }, 500)
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
    this.changeDetectorRef.detectChanges();
    }
  }

  ngOnDestroy() {

  }

  createForm() {
    this.changePasswordForm = this.formBuilder.group({
      'currentPasswordControl': [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ],
      newPasswordGroup: this.formBuilder.group({
        'passwordControl': [
          '',
          [
            Validators.required,
            Validators.minLength(6)
          ]
        ],
        'confirmPasswordControl': [
          '', Validators.required]
      }, { validator: this.passwordConfirming })
    })
  }

  get formControls() {
    this.currentPasswordControl = this.changePasswordForm.get('currentPasswordControl');
    this.passwordControl = this.changePasswordForm.get(['newPasswordGroup', 'passwordControl']);
    this.confirmPasswordControl = this.changePasswordForm.get(['newPasswordGroup', 'confirmPasswordControl']);

    super.baseFormControl();

    return this.currentPasswordControl || this.passwordControl || this.confirmPasswordControl;

  }

  onSubmit(event) {
    console.log(this.changePasswordForm)
  }

  passwordConfirming(c: AbstractControl): { invalid: boolean } {
    let passValue = c.get('passwordControl').value
    let confpassValue = c.get('confirmPasswordControl').value
    if (passValue !== confpassValue) {
      c.get('confirmPasswordControl').setErrors({ 'mismatch': true })
      return { invalid: true };
    }
  }

  changePassword(event) {
    this.clickOnButton = true;
    super.acoountAnimationOut()
    let changePassword = new ChangePasswordModel(
      this.changePasswordForm.get('currentPasswordControl').value,
      this.changePasswordForm.get(['newPasswordGroup', 'passwordControl']).value,
      this.changePasswordForm.get(['newPasswordGroup', 'confirmPasswordControl']).value
    );

    let changePassResult = this.userService.changePassword(changePassword)
      .then(resp => {

        this.success = true;
        super.acoountAnimationIn()
        this.countDownAndRedirect();
      })
      .catch(respError => {

        let errorMapping: Array<MappingItem> = [];

        // this.commonResponseService.dispalyErrorMessages(respError, this, errorMapping);
        super.acoountAnimationIn()
        this.clickOnButton = false;
        return respError;
      });
  }

  countDownAndRedirect() {

    let countdownInterval = setInterval(() => {

      if (this.countDown > 0) {

        this.countDown = this.countDown - 1;
      } else {
        clearInterval(countdownInterval);
        this._router.navigate([{outlets: {auth: '/accounts/profile'}}])
      }
    }, 1000);
  }

  navigateToProfile() {
    this.navigateToAccountsRoutes('profile', '');
  }

  formKeyupEnter(event) {
    if (event.target.id === 'confirmPasswordControl' && this.changePasswordForm.valid) {
      return true;
    } else {
      return false;
    }
    
  }
}
