import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, NgZone, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SnackBarService } from '../../../../features/common/snack-bar/snack-bar.service';
import { EventService } from '../../../../services/utility/event.service';
import { FormErrorStateMatcher } from '../../../../features/common/FormErrorStateMatcher';
import { AccountsEventsService } from '../../accounts-events.service';
import { BaseAccountsComponent } from '../base-accounts/base-accounts.component';
import { ContactService } from './contact-us.service';
import { ContactUsModel } from './ContactUsModel';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {take} from 'rxjs/operators';

@Component({
    selector: 'app-contact-us',
    templateUrl: 'contact-us.component.html',
    styleUrls: ['contact-us.component.scss']
})

export class ContactUsComponent extends BaseAccountsComponent implements OnInit, AfterViewInit, OnDestroy {
    _route: ActivatedRoute;
    _router: Router;
    contactForm: FormGroup;
    formErrorStateMatcher = new FormErrorStateMatcher();

    gRecaptchaResponse: string;
    gRecaptchaResponseSubscription: Subscription;

    @ViewChild('autosize') autosize: CdkTextareaAutosize;

    constructor(
        titleService: Title,
        accountsEventsService: AccountsEventsService,
        route: ActivatedRoute,
        router: Router,
        private formBuilder: FormBuilder,
        @Inject(PLATFORM_ID) private platformId: Object,
        private eventService: EventService,
        private contantService: ContactService,
        private snackBarService: SnackBarService,
        private _ngZone: NgZone
    ) {
        super(
            accountsEventsService,
            titleService,
            route,
            router
        );

        this._route = route;
        this._router = router;

        this.createForm()

    }

    triggerResize() {
        // Wait for changes to be applied, then trigger textarea resize.
        this._ngZone.onStable.pipe(take(1)).subscribe(() => this.autosize.resizeToFitContent(true));
      }

    createForm() {
        this.contactForm = this.formBuilder.group({
            'nameControl': [
                '',
                [
                    Validators.required,
                    Validators.minLength(2),
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
            'messageControl': [
                '',
                [
                    Validators.required,
                    Validators.minLength(10),
                    Validators.maxLength(800)
                ]
            ]
        })
    }

    get formControls() {
        this.nameControl = this.contactForm.get('nameControl');
        this.emailControl = this.contactForm.get('emailControl');
        this.messageControl = this.contactForm.get('messageControl');

        super.baseFormControl();

        return this.nameControl || this.emailControl || this.messageControl;
    }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            super.accountSetTitle('Contact Us')
            this.eventService.setReCaptchaState(true);
            this.gRecaptchaResponseSubscription = this.eventService.getgRecaptchaResponse()
                .subscribe(gRecaptchaResponse => {
                    this.gRecaptchaResponse = gRecaptchaResponse;
                    // this.sendMessage();
                });
        }
    }

    ngAfterViewInit(): void {
        super.acoountAnimationIn();
    }

    ngOnDestroy() {
        this.eventService.setReCaptchaState(false);
        if (this.gRecaptchaResponseSubscription) {
            this.gRecaptchaResponseSubscription.unsubscribe();
        }
    }

    validate(event) {
        super.acoountAnimationOut();
        let validateContactModel = new ContactUsModel(
            this.contactForm.get('nameControl').value,
            this.contactForm.get('emailControl').value,
            this.contactForm.get('messageControl').value
        );

        this.contantService.validate(validateContactModel)
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
        let sendContactMessage = new ContactUsModel(
            this.contactForm.get('nameControl').value,
            this.contactForm.get('emailControl').value,
            this.contactForm.get('messageControl').value
        );

        let validRequest = sendContactMessage as any;
        validRequest['g-recaptcha-response'] = this.gRecaptchaResponse;

       this.contantService.sendContactMessage(validRequest)
            .subscribe(
                () => {
                    this.snackBarService.popMessageSuccess('Message Sent');
                    this.gRecaptchaResponse = undefined;
                    this.contactForm.reset();
                    this.eventService.setReCaptchaAction('reset');
                },
                respError => this.errorResult(respError)
            )
    }

    errorResult(respError: Object): any {

        // let errorMapping: Array<MappingItem> =
        //     [
        //         new MappingItem('ErrorRegisterNameExist', 'ErrorClassEmailExist'),
        //     ];
        this.acoountAnimationIn();

        // if (respError && respError.hasOwnProperty('ErrorRegisterEmailExist')) {
        //     this.emailControl.setErrors({ 'duplicate': true });
        // }

        // if (this.ErrorClassErrorConfirmationMail === 'error') {
        //     this.navigateToAccountsRoutes('resendconfirmemail', this.returnUrl);
        // }
        this.eventService.setReCaptchaAction('reset');

        return respError;
    }

    formKeyupEnter(event) {
        if (event.target.id === 'messageControl' && this.contactForm.valid) {
          return true;
        } else {
          return false;
        }
    }
}