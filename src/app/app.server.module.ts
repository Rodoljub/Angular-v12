import { NgModule, PLATFORM_ID } from '@angular/core';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';
import {HttpClient, HTTP_INTERCEPTORS} from '@angular/common/http';
import {UniversalInterceptor} from './services/utility/universal-interceptor';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { reducers } from './store/app.state';
import { StoreModule } from '@ngrx/store';
import { BrowserModule, Meta, Title } from '@angular/platform-browser';
import { SeoResolver } from './services/utility/seo-resolver.service';
import { Router, RouterModule, Routes } from '@angular/router';
import { UtilityService } from './services/utility/utility.service';
import { ShellComponent } from './features/shell/app-shell.component';

export function seoResolverFactory(
    http: HttpClient, PLATFORM_ID, router: Router, utility: UtilityService,
    title: Title,
    meta: Meta
  ) {
  return new SeoResolver(
    PLATFORM_ID,
    http,
    router,
    utility,
    title,
    meta
  );
}

// const routes: Routes = [ { path: 'app-shell-path', component: ShellComponent }];

@NgModule({
  imports: [
    AppModule,
    BrowserModule.withServerTransition({
      appId: 'quantum'
  }),
    ServerModule,
    NoopAnimationsModule,
    ServerTransferStateModule,
    StoreModule.forRoot(reducers),
    // RouterModule.forRoot(routes),
  ],

  providers: [
    // {
    // provide: HTTP_INTERCEPTORS,
    // useClass: UniversalInterceptor,
    // multi: true
    // Add universal-only providers here
  // },
  {provide: SeoResolver,
    deps: [
      HttpClient, PLATFORM_ID, Router,
      UtilityService,
      Title, Meta
    ],
    useFactory: seoResolverFactory
  }
],
  bootstrap: [ AppComponent ]
  // ,
  // declarations: [
  //   ShellComponent
  // ]
})
export class AppServerModule {
  // constructor(private router: Router) {
  //   this.router.resetConfig(routes);
  // }
}

