import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { OidcService } from './oidc.service';
import { environment } from '../../../../environments/environment';
import { UtilityService } from '../../../services/utility/utility.service';
import { SnackBarService } from '../../../features/common/snack-bar/snack-bar.service';


@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {

    userUri = `${environment.asURi}/api/auth`
    rsUri = `${environment.rsURi}/api/profile`


    constructor(
        private router: Router,
        private utilityService: UtilityService,
        private snackBarService: SnackBarService,
        private oidcService: OidcService,
        @Inject(PLATFORM_ID) private platformId: Object
        ) { }


    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        if (isPlatformBrowser(this.platformId)) {
            return new Promise((resolve) => {
                this.oidcService.isAuthenticated().then(userAuthenticated => {
                    if (!userAuthenticated) {
                        let infoMessage = 'Please Login';
                        this.snackBarService.popMessageError(infoMessage);
                        this.router.navigate([{outlets: {auth: 'accounts/login'}}], { queryParams: { returnUrl: state.url }});
                    } else {

                    };
                    resolve(userAuthenticated);
                });
            })

        }
    }
}
