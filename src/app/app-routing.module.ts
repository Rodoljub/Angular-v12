import { NgModule }  from '@angular/core';
  import { RouterModule, Routes }  from '@angular/router';
  import { ItemsListComponent } from './features/items/items-list/items-list.component';
  import { PageNotFoundComponent } from './features/common/legal-404/page-not-found/page-not-found.component';
  import { TermsOfUseComponent } from './features/common/legal-404/terms-of-use/terms-of-use.component';
  import { PrivacyPolicyComponent } from './features/common/legal-404/privacy-policy/privacy-policy.component';
import { SeoResolver } from './services/utility/seo-resolver.service';
import { ItemsModalListComponent } from './features/items/items-modal-list/items-modal-list.component';
import { SigninRedirectCallbackComponent } from './features/accounts/components/redirect-callback/signin-redirect-callback.component';
import { SignoutRedirectCallbackComponent } from './features/accounts/components/redirect-callback/signout-redirect-callback.component';
import { IFrameSigninRedirectCallbackComponent } from './features/accounts/components/login-iframe/iframe-signin-redirect.component';
import { IFrameSigninComponent } from './features/accounts/components/login-iframe/iframe-signin.component';
import { AuthGuard } from './features/accounts/services/auth.guard';
import { GuestComponent } from './features/guest/guest.component';
import { ProfileGuard } from './features/accounts/services/profile.guard';
import { ExternalRedirectCallbackComponent } from './features/accounts/components/redirect-callback/external-redirect-callback.component';
import { ItemMediaComponent } from './features/items/item/item-media/item-media.component';


const appRoutes: Routes = [

  { path: '', component: ItemsListComponent },

  { 
    path: 'media/:id',
    component: ItemsModalListComponent,
    resolve: {
      seo: SeoResolver
    }
  },

  { path: 'guest', component: GuestComponent, canActivate: [ProfileGuard] },

  { path: 'aa/:id',
    component:
    ItemsModalListComponent,
    outlet: 'a',
    resolve: {
      seo: SeoResolver
    }
  },
  { path: 'accounts',

    outlet: 'auth',
    loadChildren: () => import('./features/accounts/accounts.module')
    .then(m => m.AccountsModule),
    // loadChildren: './features/accounts/accounts.module#AccountsModule',
  },

  { path: 'iframe-signin', component: IFrameSigninComponent },

  { path: 'iframe-signin-callback', component: IFrameSigninRedirectCallbackComponent },

  { path: 'external-signin-callback', component: ExternalRedirectCallbackComponent },

  { path: 'signin-callback', component: SigninRedirectCallbackComponent },

  { path: 'signout-callback', component: SignoutRedirectCallbackComponent },

  // { path: 'upload',
  //   // outlet: 'upload',
  //   loadChildren: './features/upload/upload.module#UploadModule'

  // },

  { path: 'user/:urlSegment', component: ItemsListComponent,
    resolve: {
      seoUser: SeoResolver
    }
  },

  { path: 'portfolio', component: ItemsListComponent, canActivate: [AuthGuard]},

  { path: 'favourites', component: ItemsListComponent, canActivate: [AuthGuard]},

  { path: 'search', component: ItemsListComponent},

  { path: 'terms', component: TermsOfUseComponent},

  { path: 'policy', component: PrivacyPolicyComponent},

  { path: '404', component: PageNotFoundComponent},

  { path: 'main.js', redirectTo: '' },

  { path: '**', redirectTo: '404'  },

];




@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {
    // initialNavigation: 'enabled'
    // , useHash: true
    // ,
    relativeLinkResolution: 'legacy'
})
// , initialNavigation: 'enabled' enableTracing: true,
  ],
  exports: [
    RouterModule
  ],

})
export class AppRoutingModule {}
