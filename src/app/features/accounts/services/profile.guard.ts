import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { OidcService } from './oidc.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileGuard implements CanActivate {

  constructor(
    private router: Router,
    private oidcService: OidcService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {

    if (isPlatformBrowser(this.platformId)) {
      return new Promise((resolve) => {
          this.oidcService.getUser().then(user => {
            if (!user) {
              resolve(true);
            }
            if (!!user) {

                this.router.navigate([{outlets: {auth: 'accounts/profile'}}]);
                resolve(false);
              };
              resolve(true);
          });
      })
    }
  }

}
