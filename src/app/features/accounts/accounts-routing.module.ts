import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/register-component/register.component';
import { ConfirmEmailComponent } from './components/confirm-email/confirm-email.component';
import { ReSendConfirmEmailComponent } from './components/confirm-email/re-send-confirm-email.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password-page/reset-password.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ProfileComponent } from './components/profile/profile.component';
import { LoginIFrameComponent } from './components/login-iframe/login-iframe.component';
import { ProfileGuard } from './services/profile.guard';
import { AuthGuard } from './services/auth.guard';
import { AccountsComponent } from './accounts.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';

const accountRoutes: Routes = [

  {

    path: '',
    component: AccountsComponent,
    children: [

      { path: 'login', component: LoginIFrameComponent,  canActivate: [ProfileGuard]},

      { path: 'register', component: RegisterComponent, canActivate: [ProfileGuard] },

      { path: 'confirm', component: ConfirmEmailComponent,  canActivate: [ProfileGuard] },

      { path: 'resendconfirmemail', component: ReSendConfirmEmailComponent, canActivate: [ProfileGuard] },

      { path: 'forgotpassword', component: ForgotPasswordComponent, canActivate: [ProfileGuard] },

      { path: 'resetpassword', component: ResetPasswordComponent,  canActivate: [ProfileGuard] },

      { path: 'changepassword', component: ChangePasswordComponent, canActivate: [AuthGuard]},

      { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},

      { path: 'contact', component: ContactUsComponent}

    ]
  },

  { path: '**', redirectTo: '404'  },
]

@NgModule({
  imports: [
    RouterModule.forChild(accountRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AccountsRoutingModule { }
