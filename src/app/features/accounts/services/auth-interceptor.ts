import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { from, Observable, throwError } from 'rxjs';
import { OidcConstants } from './oidc-constants';
import { OidcService } from './oidc.service';
@Injectable({
  providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor {
    constructor(
      @Inject(PLATFORM_ID) private platformId: Object,

        private oidcService: OidcService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      if (isPlatformBrowser(this.platformId)) {

        if (req.url.startsWith(OidcConstants.apiRoot)) {
          return from(
            this.oidcService.getUser()
            .then(user => {
              if (!!user && user.expired !== undefined && !user.expired) {
                const headers = req.headers.set('Authorization', `Bearer ${user.access_token}`);
                const authRequest = req.clone({ headers: headers });
                return next.handle(authRequest).toPromise()
                      .catch(err => {
                        return this.oidcService.revokeToken()
                            .then(newUser => {
                              const headers = req.headers.set('Authorization', `Bearer ${newUser.access_token}`);
                              const authRequest = req.clone({ headers: headers });
                              return next.handle(authRequest).toPromise()
                                .catch(err => {
                                  console.log(err);
                                  if (err.status === 401) {
                                    this.oidcService.logout();
                                  }
                                  return throwError(err).toPromise();
                                });
                            });
                      });
              } else if (!!user && (user.expired || user.expired === undefined)) {
               return this.oidcService.revokeToken()
                  .then(newUser => {
                    const headers = req.headers.set('Authorization', `Bearer ${newUser.access_token}`);
                    const authRequest = req.clone({ headers: headers });
                    return next.handle(authRequest).toPromise()
                      .catch(err => {
                        console.log(err);
                        if (err.status === 401) {
                          this.oidcService.logout();
                        }
                        return throwError(err).toPromise();
                      });
                  });
              } else {
                return next.handle(req).toPromise();
              }
            })
          );
        } else {
          return next.handle(req);
        }

    }

    if (isPlatformServer(this.platformId)) {
      return next.handle(req);
    }
  }
}
