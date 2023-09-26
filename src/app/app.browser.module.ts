import { NgModule, PLATFORM_ID, Inject, APP_ID } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppModule} from './app.module';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { isPlatformBrowser } from '../../node_modules/@angular/common';
import {TransferHttpCacheModule} from '@nguniversal/common';
// import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ProfileEffects } from './store/effects/profile.effects';
import { reducers } from './store/app.state';


import {
  MetaReducer
} from '@ngrx/store';
import {
  hydrationMetaReducer
} from './store/reducers/hydration.reducer';
import { SavedSearchesEffects } from './store/effects/saved-searches.effects';
import { SearchFormEffects } from './store/effects/search-form.effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { CurrentSearchEffects } from './store/effects/current-search.effects';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NotificationsEffects } from './features/notifications/store/notifications.effects';
import { UploadEffects } from './features/upload/store/upload.effects';

export const metaReducers: MetaReducer<any>[] = [hydrationMetaReducer];

@NgModule({
  imports: [
    AppModule,
    BrowserModule.withServerTransition({
        appId: 'quantum'
    }),
    // ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    BrowserAnimationsModule,
    TransferHttpCacheModule,
    StoreModule.forRoot(reducers, {
      metaReducers
   }),
    EffectsModule.forRoot([
      ProfileEffects, SavedSearchesEffects, SearchFormEffects, CurrentSearchEffects,
      NotificationsEffects, UploadEffects
    ]),
    StoreDevtoolsModule.instrument({maxAge: 50}),
    // ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),

  ],
  bootstrap: [AppComponent]
})
export class AppBrowserModule {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(APP_ID) private appId: string) {
    const platform = isPlatformBrowser(platformId) ?
      'in the browser' : 'on the server';
    console.log(`Running ${platform} with appId=${appId}`);
  }
}
