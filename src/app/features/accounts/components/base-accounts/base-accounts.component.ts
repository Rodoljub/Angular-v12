import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { AbstractControl } from '@angular/forms';
import { CommonResponseService } from '../../../../services/utility/common-response.service';
import { AccountsEventsService } from '../../accounts-events.service';
import { environment } from '../../../../../environments/environment';
import { config } from '../../../../../config/config';
import { configMessages } from 'src/config/configMessages';

@Component({
  selector: '[qq-base-accounts]',
  templateUrl: './base-accounts.component.html',
  providers: [
    CommonResponseService
  ]
})
export class BaseAccountsComponent {

  animationSubscription: Subscription;

  nameControl: AbstractControl;
  emailControl: AbstractControl;
  passwordControl: AbstractControl;
  confirmPasswordControl: AbstractControl;
  currentPasswordControl: AbstractControl;
  selectedFileControl: AbstractControl;
  messageControl: AbstractControl;

  nameControlError = false;
  nameControlErrorMessage = '';
  emailControlError = false;
  emailControlErrorMessage = '';
  passwordControlError = false;
  passwordControlErrorMessage = '';
  confirmPasswordControlError = false;
  confirmPasswordControlErrorMessage = '';
  currentPasswordControlError = false;
  currentPasswordControlErrorMessage = '';
  selectedFileControlError = false;
  selectedFileControlErrorMessage = '';
  messageControlError = false;
  messageControlErrorMessage = '';
  messageHintMessage: string;
  messageMaxCharacters = config.messageMaxChar;

  constructor(
    private accountsEventsService: AccountsEventsService,
    private titleService: Title,
    private route: ActivatedRoute,
    private router: Router
  ) {

  }

  baseFormControl() {

    if (this.nameControl) {
      if (this.nameControl.errors
          && (this.nameControl.dirty || this.nameControl.touched || this.nameControl.pristine)) {
          this.nameControlError = true;
          if (this.nameControl.errors.required) {
              this.nameControlErrorMessage = config.nameRequired;
          }
          if (this.nameControl.errors.minlength) {
              this.nameControlErrorMessage = config.nameMinLenght;
          }
          if (this.nameControl.dirty && this.nameControl.errors.maxlength) {
              this.nameControlErrorMessage = config.nameMaxLength;
          }
          if (this.nameControl.errors.duplicate) {
              this.nameControlErrorMessage = config.nameDuplicateFirstSentance
              + this.nameControl.value + config.nameDuplicateSecondSentance;
          }
        } else {
            this.nameControlError = false;
      }
    }

    if (this.emailControl) {
      if (this.emailControl.invalid
          && (this.emailControl.dirty || this.emailControl.touched || this.emailControl.pristine) ) {
          this.emailControlError = true;
          if (this.emailControl.errors.required) {
            this.emailControlError = true;
              this.emailControlErrorMessage = config.emailRequired;
          }
          if (this.emailControl.errors.required !== true && this.emailControl.errors.email) {
              this.emailControlErrorMessage = config.emilNotValidFormat;
          }
          if (this.emailControl.errors.duplicate) {
              this.emailControlErrorMessage =  this.emailControl.value + config.emailAlreadyRegistered;
          }
          if (this.emailControl.errors.emailorpass) {
              this.emailControlErrorMessage = config.emailOrPassNotValid
          }
          if (this.emailControl.errors.notfoundmail) {
              this.emailControlErrorMessage = config.emailNotFound
          }
        } else {
          this.emailControlError = false;
        if (this.passwordControl) {
          if (this.passwordControl.errors) {
            if (this.passwordControl.errors.emailorpass) {
              this.passwordControl.setErrors(null);
            }
          }
        }
      }
    }

    if (this.passwordControl) {
      if (this.passwordControl.errors) {
          this.passwordControlError = true;
          if (this.passwordControl.errors.required) {
              this.passwordControlErrorMessage = config.passwordRequired;
          }
          if (this.passwordControl.errors.minlength) {
              this.passwordControlErrorMessage = config.passwordMinLength;
          }
          if (this.passwordControl.errors.emailorpass) {
            this.passwordControlErrorMessage = ''
          }
        } else {
            this.passwordControlError = false;
          if (this.emailControl) {
            if (this.emailControl.errors) {
              if (this.emailControl.errors.emailorpass) {
                this.emailControl.setErrors(null);
              }
            }
          }
      }
    }

    if (this.confirmPasswordControl) {
      if (this.confirmPasswordControl.errors) {
          this.confirmPasswordControlError = true;
          if (this.confirmPasswordControl.errors.required) {
              this.confirmPasswordControlErrorMessage = config.confirmPasswordRequired;
          }
          if (this.confirmPasswordControl.errors.mismatch) {
            this.confirmPasswordControlErrorMessage = config.confirmPasswordMismatch
          }
        } else {
            this.confirmPasswordControlError = false;
      }
    }

    if (this.currentPasswordControl) {
      if (this.currentPasswordControl.errors) {
          this.currentPasswordControlError = true;
          if (this.currentPasswordControl.errors.required) {
              this.currentPasswordControlErrorMessage = config.currentPasswordRequired;
          }
          if (this.currentPasswordControl.errors.minlength) {
            this.currentPasswordControlErrorMessage = config.currentPasswordMinLength
          }
        } else {
            this.currentPasswordControlError = false;
      }
    }

    if (this.selectedFileControl) {
      if (this.selectedFileControl.errors) {
          this.selectedFileControlError = true;
          if (this.selectedFileControl.errors.formatnotvalid) {
              this.selectedFileControlErrorMessage = config.selectedFileControlFormatNotValid;
          }
        } else {
            this.selectedFileControlError = false;
      }
    }

    if (this.messageControl) {
      if (this.messageControl.errors
        && (this.messageControl.dirty || this.messageControl.touched || this.messageControl.pristine)) {
        this.messageControlError = true;
        if (this.messageControl.errors.required) {
            this.messageControlErrorMessage = config.messageRequired;
        }
        if (this.messageControl.errors.minlength) {
            this.messageControlErrorMessage = config.messageMinLength;
        }
        if (this.messageControl.dirty && this.messageControl.errors.maxlength) {
            this.messageControlErrorMessage = config.messageMaxLength;
        }
      } else {
        if (this.messageControl.value && this.messageControl.value.length === config.messageMaxChar) {
          this.messageHintMessage = configMessages.contact.message;
        } else {
          this.messageHintMessage = '';
        }

          this.messageControlError = false;
      }
    }
  }

  navigateToAccountsRoutes(route: any, returnUrl: string, fragment?: string) {
    let navigationExtras: NavigationExtras = {
      queryParams: { returnUrl: returnUrl },
      fragment : fragment
    };
    this.router.navigate([{ outlets: { auth: 'accounts/' + route }, navigationExtras }]);
  }

  acoountAnimationOut() {
    this.accountsEventsService.setAnimation('out');
  }

  acoountAnimationIn() {
    this.accountsEventsService.setAnimation('in');
  }

  accountSetTitle(title: string) {
    this.titleService.setTitle(title);
    this.accountsEventsService.setAccountsCardTitle(title);
  }

  setAccountProgressBar(progress) {
    this.accountsEventsService.setAccountProgressBar(progress);
  }

}
