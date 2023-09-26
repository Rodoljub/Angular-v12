import {
  Component,
  OnInit,
  ElementRef,
  ViewChild, AfterViewInit, OnDestroy, Inject, ChangeDetectorRef, PLATFORM_ID, Renderer2
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title, By } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonResponseService } from '../../../../services/utility/common-response.service';
import { BaseAccountsComponent } from '../base-accounts/base-accounts.component';
import { FormErrorStateMatcher } from '../../../common/FormErrorStateMatcher';
import { EventService } from '../../../../services/utility/event.service';
import { AccountsEventsService } from '../../accounts-events.service';
import { MappingItem } from '../../../../shared/mappingItem';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { SnackBarService } from '../../../common/snack-bar/snack-bar.service';
import { EmailModel } from '../../models/EmailModel';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  providers: [
    CommonResponseService
  ]
})
export class ForgotPasswordComponent extends BaseAccountsComponent implements OnInit, AfterViewInit, OnDestroy {

  forgotPasswordForm: FormGroup;
  ErrorClassEmail = '';
  ErrorClassErrorEmailNotSent = '';

  gRecaptchaResponse: string;
  gRecaptchaResponseSubscription: Subscription;
  success = false;
  siteKey: string = environment.siteKey;

  @ViewChild('emailInput', {static: false}) emailInput: ElementRef;

  formErrorStateMatcher = new FormErrorStateMatcher();

  constructor(
    route: ActivatedRoute,
    titleService: Title,
    router: Router,
    private userService: UserService,
    private SnackBarServics: SnackBarService,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private commonResponseService: CommonResponseService,
    private eventService: EventService,
    @Inject(DOCUMENT) private document: Document,
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    accountsEventsService: AccountsEventsService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    super(
      accountsEventsService,
      titleService,
      route,
      router
    )

    this.createForm();

  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // window.scrollTo(0, 0);
      super.acoountAnimationIn();
      super.accountSetTitle('Forgot Your password?')


      this.gRecaptchaResponseSubscription = this.eventService.getgRecaptchaResponse()
        .subscribe(gRecaptchaResponse => {
          this.gRecaptchaResponse = gRecaptchaResponse;
          this.sendEmail();
        })
      this.eventService.setReCaptchaState(true);
      setTimeout(() => {
        this.renderer.selectRootElement(this.emailInput.nativeElement).focus();
      }, 500)
    }

  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.changeDetectorRef.detectChanges();
    }
  }


  ngOnDestroy() {
    if (this.gRecaptchaResponseSubscription) {
      this.gRecaptchaResponseSubscription.unsubscribe();
    }
    this.eventService.setReCaptchaState(false);
  }

  createForm() {
    this.forgotPasswordForm = this.formBuilder.group({
      'emailControl': [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],
    })
  }

  get formControls() {
    this.emailControl = this.forgotPasswordForm.get('emailControl');

    super.baseFormControl();

    return this.emailControl;
  }

  validate1(event) {
    super.acoountAnimationOut()
    let validateEmail = new EmailModel(this.forgotPasswordForm.get('emailControl').value, null);

    this.userService.validateDataEmail(validateEmail)
      .subscribe(
        () => this.eventService.setReCaptchaAction('execute'),
        error => {
          this.errorResult(error)
        }
      )
  }

  sendEmail() {

    let sendEmail = new EmailModel(this.forgotPasswordForm.get('emailControl').value, null);

    let validRequest = sendEmail as any;
    validRequest['g-recaptcha-response'] = this.gRecaptchaResponse;
    let sendResult = this.userService.sendReseetPasswordEmail(validRequest)
      .then(response => {
        this.SnackBarServics.popMessageSuccess('Reset password email successfuly sent!');
        this.gRecaptchaResponse = undefined;
        this.success = true;
        super.acoountAnimationIn()
      })
      .catch(respError => {
        super.acoountAnimationIn()
        this.errorResult(respError)
      });
  }

  errorResult(respError: any): any {

    let errorMapping: Array<MappingItem> = [new MappingItem('EmailNotFound', 'ErrorClassEmail')];
    // this.commonResponseService.dispalyErrorMessages(respError, this, errorMapping, 1);
    if (this.ErrorClassEmail === 'error') {
      this.forgotPasswordForm.get('emailControl').setErrors({ 'notfoundmail': true })
    }
    this.eventService.setReCaptchaAction('reset');
    this.success = false;
    super.acoountAnimationIn()
    this.ErrorClassEmail = '';
    return respError;
  }

  onLoginLink(route) {
    this.navigateToAccountsRoutes(route, '/');
}

}
