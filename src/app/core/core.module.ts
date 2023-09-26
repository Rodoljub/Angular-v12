import { ErrorHandler, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


import { ReCaptchaModule } from 'angular2-recaptcha';
import { SharedModule } from '../shared/shared.module';
import { HeaderComponent } from '../features/navigation/header/header.component';
import { SearchComponent } from '../features/search/search.component';
import { FooterComponent } from '../features/navigation/footer/footer.component';
import { RecaptchaComponent } from '../features/common/recaptcha/recaptcha.component';

import { MatDialogComponent } from '../features/common/mat-dialog/mat-dialog.component';
import { BaseNavigationComponent } from '../features/navigation/base-navigation/base-navigation.component';
import { throwIfAlreadyLoaded } from './module-import-guard';
import { ReportDialogComponent } from '../features/common/mat-dialog/report-dialog/report-dialog.component';
import { SearchActionBarComponent } from '../features/search/search-action-bar/search-action-bar.component';
import { SnackBarComponent } from '../features/common/snack-bar/snack-bar.component';
import { MessageActionBarComponent } from '../features/common/snack-bar/message-action-bar/message-action-bar.component';
import { HeaderDesktopComponent } from '../features/navigation/header/header-desktop/header-desktop.component';
import { HeaderMenuComponent } from '../features/navigation/header/header-menu/header-menu.component';
import { HeaderMobileComponent } from '../features/navigation/header/header-mobile/header-mobile.component';
import { HeaderAuthComponent } from '../features/navigation/header/header-auth/header-auth.component';
import { HeaderViewComponent } from '../features/navigation/header/header-view/header-view.component';
import { UploadComponent } from '../features/upload/upload.component';
import { SigninRedirectCallbackComponent } from '../features/accounts/components/redirect-callback/signin-redirect-callback.component';
import { SignoutRedirectCallbackComponent } from '../features/accounts/components/redirect-callback/signout-redirect-callback.component';
import { IFrameSigninRedirectCallbackComponent } from '../features/accounts/components/login-iframe/iframe-signin-redirect.component';
import { IFrameSigninComponent } from '../features/accounts/components/login-iframe/iframe-signin.component';
import { GuestComponent } from '../features/guest/guest.component';
import { GuestAuthNavComponent } from '../features/guest/guest-auth-nav/guest-auth-nav.component';
import { GuestInterestsComponent } from '../features/guest/guest-interests/guest-interests.component';
import { SearchTagsFormComponent } from '../features/guest/guest-interests/search-tags-form/search-tags-form.component';
import { CoockiesNoticeComponent } from '../features/common/legal-404/coockies-notice/coockies-notice.component';
import { MainSpinnerComponent } from '../features/common/progress-loaders/main-spinner/main-spinner.component';
import { SignalRComponent } from '../features/notifications/signalr/signalr.component';
import { NotificationsComponent } from '../features/notifications/notifications.component';
import { NotificationComponent } from '../features/notifications/notification/notification.component';
import { NotificationListComponent } from '../features/notifications/notification-list/notification-list.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ExternalRedirectCallbackComponent } from '../features/accounts/components/redirect-callback/external-redirect-callback.component';



@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    ReCaptchaModule,
    RouterModule,
    // UploadModule,
  ],
  declarations: [
    MainSpinnerComponent,
    HeaderComponent,
    HeaderMenuComponent,
    HeaderDesktopComponent,
    HeaderMobileComponent,
    HeaderAuthComponent,
    HeaderViewComponent,
    SearchComponent,
    FooterComponent,
    RecaptchaComponent,
    SnackBarComponent,
    MessageActionBarComponent,
    SearchActionBarComponent,
    MatDialogComponent,
    ReportDialogComponent,
    BaseNavigationComponent,
    UploadComponent,
    SigninRedirectCallbackComponent,
    ExternalRedirectCallbackComponent,
    IFrameSigninComponent,
    IFrameSigninRedirectCallbackComponent,
    SignoutRedirectCallbackComponent,
    GuestComponent,
    GuestAuthNavComponent,
    GuestInterestsComponent,
    SearchTagsFormComponent,
    CoockiesNoticeComponent,
    NotificationsComponent,
    NotificationListComponent,
    NotificationComponent,
    SignalRComponent,

  ],
  exports: [
    MainSpinnerComponent,
    HeaderComponent,
    HeaderMenuComponent,
    HeaderDesktopComponent,
    HeaderMobileComponent,
    HeaderAuthComponent,
    HeaderViewComponent,
    SearchComponent,
    FooterComponent,
    RecaptchaComponent,
    ReCaptchaModule,
    SnackBarComponent,
    MessageActionBarComponent,
    SearchActionBarComponent,
    MatDialogComponent,
    ReportDialogComponent,
    BaseNavigationComponent,
    UploadComponent,
    IFrameSigninComponent,
    IFrameSigninRedirectCallbackComponent,
    SigninRedirectCallbackComponent,
    ExternalRedirectCallbackComponent,
    SignoutRedirectCallbackComponent,
    GuestComponent,
    GuestAuthNavComponent,
    GuestInterestsComponent,
    SearchTagsFormComponent,
    CoockiesNoticeComponent,
    NotificationsComponent,
    NotificationListComponent,
    NotificationComponent,
    SignalRComponent,

  ],
  providers: [

    // { provide: MatDialogRef, useValue: {} },
    // { provide: MAT_DIALOG_DATA, useValue: {} },
  ]
})
export class CoreModule {
  constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
