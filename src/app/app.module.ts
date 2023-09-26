import { BrowserModule, Meta, Title } from '@angular/platform-browser';
  import { ErrorHandler, NgModule, PLATFORM_ID } from '@angular/core';
  import { FormsModule, ReactiveFormsModule } from '@angular/forms';
  import { AppRoutingModule } from './app-routing.module';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
  import { PageNotFoundComponent } from './features/common/legal-404/page-not-found/page-not-found.component';
  import { TermsOfUseComponent } from './features/common/legal-404/terms-of-use/terms-of-use.component';
  import { PrivacyPolicyComponent } from './features/common/legal-404/privacy-policy/privacy-policy.component';


import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module';
import { environment } from '../environments/environment';
// import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
// import { InMemoryDataService } from './in-memory-data.service';
import { MetaReducer, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ProfileEffects } from './store/effects/profile.effects';
import { EffectsModule } from '@ngrx/effects';
import { reducers } from './store/app.state';
import { ServiceWorkerModule } from '@angular/service-worker';
import { hydrationMetaReducer } from './store/reducers/hydration.reducer';
import { SavedSearchesEffects } from './store/effects/saved-searches.effects';
import { SearchFormEffects } from './store/effects/search-form.effects';
import { CurrentSearchEffects } from './store/effects/current-search.effects';
import { UploadEffects } from './features/upload/store/upload.effects';
import { NotificationsEffects } from './features/notifications/store/notifications.effects';
import { interceptorProviders } from './interceptors/interceptors';
import { SeoResolver } from './services/utility/seo-resolver.service';
import { ItemService } from './services/rs/item.service';
import { Router } from '@angular/router';
import { ProfileService } from './features/accounts/services/profile.service';
import { UtilityService } from './services/utility/utility.service';

import {TransferHttpCacheModule} from '@nguniversal/common';


// import {
//   MetaReducer
// } from '@ngrx/store';
// import {
//   hydrationMetaReducer
// } from './store/reducers/hydration.reducer';

// export const metaReducers: MetaReducer<any>[] = [hydrationMetaReducer];
export const metaReducers: MetaReducer<any>[] = [hydrationMetaReducer];

export function seoResolverFactory(http: HttpClient, PLATFORM_ID, router: Router, utility: UtilityService,
  title: Title,
  meta: Meta) {
  return new SeoResolver(
    PLATFORM_ID,
    http,
    router,
    utility,
    title,
    meta
  );
}

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    TermsOfUseComponent,
    PrivacyPolicyComponent

  ],
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,

    BrowserModule.withServerTransition({
      appId: 'quantum'
  }),
  BrowserAnimationsModule,
  // TransferHttpCacheModule,
  StoreModule.forRoot(reducers, {
    metaReducers
 }),
  EffectsModule.forRoot([
    ProfileEffects, SavedSearchesEffects, SearchFormEffects, CurrentSearchEffects,
    NotificationsEffects, UploadEffects
  ]),
  StoreDevtoolsModule.instrument({maxAge: 50}),
  


  // InMemoryWebApiModule.forRoot(InMemoryDataService),
    BrowserAnimationsModule,
   ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [
    interceptorProviders,
    Title,
    {provide: SeoResolver, deps: [HttpClient, PLATFORM_ID, Router, UtilityService,
    Title, Meta], useFactory: seoResolverFactory}

  ],
  bootstrap: [AppComponent]

})
export class AppModule {

}
