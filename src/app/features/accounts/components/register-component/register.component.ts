import { Component, OnInit, Inject, OnDestroy, AfterViewInit, ChangeDetectorRef, PLATFORM_ID } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BaseAccountsComponent } from '../base-accounts/base-accounts.component';
import { environment } from '../../../../../environments/environment';
import { FormErrorStateMatcher } from '../../../common/FormErrorStateMatcher';
import { AccountsEventsService } from '../../accounts-events.service';
import { CommonResponseService } from '../../../../services/utility/common-response.service';
import { EventService } from '../../../../services/utility/event.service';
import { UtilityService } from '../../../../services/utility/utility.service';
import { CreateUserModel } from '../../models/CreateUserModel';
import { MappingItem } from '../../../../shared/mappingItem';
import { isPlatformBrowser } from '@angular/common';
import { SnackBarService } from '../../../common/snack-bar/snack-bar.service';
import { UserService } from '../../services/user.service';


@Component({
    selector: '[app-register]',
    templateUrl: './register.component.html',
    styleUrls: ['register.component.scss']

})

export class RegisterComponent extends BaseAccountsComponent implements OnInit, AfterViewInit, OnDestroy {

    registerForm: FormGroup
    ErrorClassEmailExist = '';
    ErrorClassErrorConfirmationMail = '';
    gRecaptchaResponse: string;
    gRecaptchaResponseSubscription: Subscription;
    returnUrl: string;

    asUri: string = environment.asURi;

    formErrorStateMatcher = new FormErrorStateMatcher();


    _route: ActivatedRoute;
    _router: Router;

    public constructor(
        titleService: Title,
        accountsEventsService: AccountsEventsService,
        route: ActivatedRoute,
        router: Router,
        private userService: UserService,
        private snackBarService: SnackBarService,
        private commonResponseService: CommonResponseService,
        private eventService: EventService,
        private utilityService: UtilityService,
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

        this._route = route;
        this._router = router;

        this.createForm()
    }

    ngOnInit() {

        if (isPlatformBrowser(this.platformId)) {
            // window.scrollTo(0, 0);
            super.accountSetTitle('Create Account')
            this.eventService.setReCaptchaState(true);
            this.gRecaptchaResponseSubscription = this.eventService.getgRecaptchaResponse()
                .subscribe(gRecaptchaResponse => {
                    this.gRecaptchaResponse = gRecaptchaResponse;
                    this.register();
                });
        }
    }

    ngAfterViewInit() {
        super.acoountAnimationIn();
    }

    ngOnDestroy() {
        this.eventService.setReCaptchaState(false);
        if (this.gRecaptchaResponseSubscription) {
            this.gRecaptchaResponseSubscription.unsubscribe();
        }


    }

    createForm() {
        this.registerForm = this.formBuilder.group({
            'nameControl': [
                '',
                [
                    Validators.required,
                    Validators.minLength(4),
                    Validators.maxLength(25)
                ]
            ],
            'emailControl': [
                '',
                [
                    Validators.required,
                    Validators.email
                ]
            ],
            'passwordControl': [
                '',
                [
                    Validators.required,
                    Validators.minLength(6)
                ]
            ]
        })
    }

    get formControls() {
        this.nameControl = this.registerForm.get('nameControl');
        this.emailControl = this.registerForm.get('emailControl');
        this.passwordControl = this.registerForm.get('passwordControl');

        super.baseFormControl();

        return this.nameControl || this.emailControl || this.passwordControl;
    }

    onTermsPolicy(route) {
        this._router.navigate(['', route]);
        setTimeout(() => {
            this._router.navigate([{outlets: {auth: null}}]);
        }, 50)
    }

    onLoginLink(route) {
        super.acoountAnimationOut()
        this.navigateToAccountsRoutes(route, this.returnUrl);
    }

    validate(event) {
        super.acoountAnimationOut();
        let validateUser = new CreateUserModel(
            this.registerForm.get('nameControl').value,
            this.registerForm.get('emailControl').value,
            this.registerForm.get('passwordControl').value,
            this.returnUrl
        );

        this.userService.userDataValidation(validateUser)
            .subscribe(
                () => {
                    this.eventService.setReCaptchaAction('execute');
                },
                error => {
                    this.errorResult(error)
                }
            )
    }

    register() {
        super.acoountAnimationOut();
        let registerUser = new CreateUserModel(
            this.registerForm.get('nameControl').value,
            this.registerForm.get('emailControl').value,
            this.registerForm.get('passwordControl').value,
            this.returnUrl
        );

        let validRequest = registerUser as any;
        validRequest['g-recaptcha-response'] = this.gRecaptchaResponse;

       this.userService.registerUser(validRequest)
            .subscribe(
                () => {
                    this.snackBarService.popMessageSuccess('Your account is successfully created! Please confirm email.');
                    this.gRecaptchaResponse = undefined;
                    this.registerForm.reset();
                    localStorage.removeItem('tempUserData');
                    this.eventService.setReCaptchaAction('reset');
                    this.navigateToAccountsRoutes('resendconfirmemail', this.returnUrl, 'focus');

                },
                respError => this.errorResult(respError)
            )
    }

    errorResult(respError: Object): any {

        let errorMapping: Array<MappingItem> =
            [
                new MappingItem('ErrorRegisterNameExist', 'ErrorClassEmailExist'),
            ];
        this.acoountAnimationIn();
        // this.commonResponseService.dispalyErrorMessages(respError, this, errorMapping, 1);
        if (respError && respError.hasOwnProperty('ErrorRegisterEmailExist')) {
            this.emailControl.setErrors({ 'duplicate': true });
        }

        if (this.ErrorClassErrorConfirmationMail === 'error') {
            this.navigateToAccountsRoutes('resendconfirmemail', this.returnUrl);
        }
        this.eventService.setReCaptchaAction('reset');

        return respError;
    }

    formKeyupEnter(event) {
        if (event.target.id === 'passwordControl' && this.registerForm.valid) {
          return true;
        } else {
          return false;
        }
    }
}
