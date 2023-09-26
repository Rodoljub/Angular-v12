import {
  Component, OnInit, ElementRef,
  ViewChild, OnDestroy, PLATFORM_ID, Inject, Renderer2
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title, By } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonResponseService } from '../../../../services/utility/common-response.service';
import { BaseAccountsComponent } from '../base-accounts/base-accounts.component';
import { FormErrorStateMatcher } from '../../../common/FormErrorStateMatcher';
import { EventService } from '../../../../services/utility/event.service';
import { AccountsEventsService } from '../../accounts-events.service';
import { MappingItem } from '../../../../shared/mappingItem';
import { isPlatformBrowser } from '@angular/common';
import { SnackBarService } from '../../../common/snack-bar/snack-bar.service';
import { EmailModel } from '../../models/EmailModel';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-re-send-confirm-email',
  templateUrl: './re-send-confirm-email.component.html',
  providers: [
    CommonResponseService
  ]
})
export class ReSendConfirmEmailComponent extends BaseAccountsComponent implements OnInit, OnDestroy {

  reSendConfirmEmailForm: FormGroup
  returnUrl: string;
  inputOpen = false;

  email: string
  ErrorClassEmail: string;
  gRecaptchaResponse: string;
  gRecaptchaResponseSubscription: Subscription;
  success = false;
  siteKey: string = environment.siteKey

  @ViewChild('emailInput', {static: false}) emailInput: ElementRef;

  formErrorStateMatcher = new FormErrorStateMatcher();

  _route: ActivatedRoute;
  _router: Router;

  constructor(
    route: ActivatedRoute,
    titleService: Title,
    router: Router,
    private userService: UserService,
    private snackBarService: SnackBarService,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private commonResponseService: CommonResponseService,
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
    )
    this._route = route;
    this._router = router;

    this.createForm();
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // window.scrollTo(0, 0);
      super.accountSetTitle(('Confirm email'))
      super.acoountAnimationIn()

      this.gRecaptchaResponseSubscription = this.eventService.getgRecaptchaResponse()
        .subscribe(gRecaptchaResponse => {
          this.gRecaptchaResponse = gRecaptchaResponse;
          this.reSendConfirmEmail();
        });
      this.eventService.setReCaptchaState(true);
      this._route.queryParams.subscribe(params => {
        this.returnUrl = this._route.snapshot.queryParams['returnUrl'] as string;
      })
    }
  }

  ngOnDestroy() {
    if (this.gRecaptchaResponseSubscription) {
      this.gRecaptchaResponseSubscription.unsubscribe();
    }
    this.eventService.setReCaptchaState(false);
  }

  createForm() {
    this.reSendConfirmEmailForm = this.formBuilder.group({
      'emailControl': [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ]
    })
  }

  get formControls() {
    this.emailControl = this.reSendConfirmEmailForm.get('emailControl');

    super.baseFormControl();

    return this.emailControl;
  }

  resetErorrs() {
    this.ErrorClassEmail = '';
  }

  validate(event) {
    super.acoountAnimationOut()
    let validateEmail = new EmailModel(this.reSendConfirmEmailForm.get('emailControl').value, this.returnUrl);

    this.userService.validateDataEmail(validateEmail)
      .subscribe(
        () => {
          this.eventService.setReCaptchaAction('execute')
        },
        error => {
          super.acoountAnimationIn()
          this.errorResult(error)
        }
      )
  }

  reSendConfirmEmail() {

    super.acoountAnimationOut()
    let sendEmail = new EmailModel(this.reSendConfirmEmailForm.get('emailControl').value, this.returnUrl);

    let validRequest = sendEmail as any;
    validRequest['g-recaptcha-response'] = this.gRecaptchaResponse;

    let sendResult = this.userService.reSendConfirmationEmail(validRequest)
      .then(response => {
        this.snackBarService.popMessageSuccess('Confirmation email successfuly sent!');

        this.resetErorrs();
        super.acoountAnimationIn()
        this.success = true;
        this.gRecaptchaResponse = undefined;
        this.email = undefined;
        this.eventService.setReCaptchaAction('reset')
      })
      .catch(respError => {
        this.errorResult(respError)

      });
  }

  errorResult(respError: any): any {

    this.resetErorrs();
    let errorMapping: Array<MappingItem> = [];
    // this.commonResponseService.dispalyErrorMessages(respError, this, errorMapping);
    if (this.ErrorClassEmail === 'error') {
      this.reSendConfirmEmailForm.get('emailControl').setErrors({ 'notfoundmail': true })
    }
    this.eventService.setReCaptchaAction('reset')
    super.acoountAnimationIn()
    return respError;
  }

  openInput() {
    this.inputOpen = true;
    setTimeout(() => {
      this.renderer.selectRootElement(this.emailInput.nativeElement).focus();
    }, 500)
  }

}
