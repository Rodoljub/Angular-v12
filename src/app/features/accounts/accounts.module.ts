import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { AccountsRoutingModule } from './accounts-routing.module';
import { BaseAccountsComponent } from './components/base-accounts/base-accounts.component';
import { AccountsComponent } from './accounts.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register-component/register.component';
import { ResetPasswordComponent } from './components/reset-password-page/reset-password.component';
import { ConfirmEmailComponent } from './components/confirm-email/confirm-email.component';
import { ReSendConfirmEmailComponent } from './components/confirm-email/re-send-confirm-email.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { throwIfAlreadyLoaded } from '../../core/module-import-guard';
import { LoginIframeDirective } from './components/login-iframe/login-iframe.directive';
import { LoginIFrameComponent } from './components/login-iframe/login-iframe.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AccountsRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    BaseAccountsComponent,
    AccountsComponent,
    ProfileComponent,
    RegisterComponent,
    ResetPasswordComponent,
    ConfirmEmailComponent,
    ReSendConfirmEmailComponent,
    ForgotPasswordComponent,
    ChangePasswordComponent,
    LoginIFrameComponent,
    LoginIframeDirective,
    ContactUsComponent
  ],

  // exports: [AccountsComponent],
  bootstrap: [AccountsComponent]
})
export class AccountsModule {
  constructor( @Optional() @SkipSelf() parentModule: AccountsModule) {
    throwIfAlreadyLoaded(parentModule, 'AccountsModule');
  }
 }
