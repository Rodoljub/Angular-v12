import { Component, OnInit, PLATFORM_ID, Inject, ViewEncapsulation } from '@angular/core';
import { config } from '../../../../../config/config';
import { Router, ActivationEnd, NavigationEnd, ActivatedRoute, NavigationExtras } from '@angular/router';
import { isPlatformBrowser, Location } from '@angular/common';
import { OidcService } from '../../../accounts/services/oidc.service';
import { ProgressSpinnerModel } from '../../../../features/common/progress-loaders/progress-spinner/ProgressSpinnerModel';
import { EventService } from '../../../../services/utility/event.service';

@Component({
    selector: 'app-header-auth',
    templateUrl: './header-auth.component.html',
    styleUrls: ['header-auth.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class HeaderAuthComponent implements OnInit {
    loginPath = config.routeConfigPath.accounts.login;
    registerPath = config.routeConfigPath.accounts.register;

    loginLabel = config.tooltips.login;
    registerLabel = config.tooltips.register;

    loginActive = false;
    registerActive = false;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        private oidcService: OidcService,
        private eventService: EventService
    ) { }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.routerEvents();
            this.setActive(this.location.path().slice(1));

           
        }
     }

     routerEvents() {
        this.router.events.subscribe((evt: NavigationEnd) => {

            if (!(evt instanceof NavigationEnd)) {
              return;
            }
            console.log('header-desktop:' + evt)
            this.setActive(evt.url.slice(1));

        });
    }

    setActive(path: string) {
        this.resetActive();

        if (path.startsWith(this.loginPath)) {
            this.loginActive = true;
        } else if (path.startsWith(this.registerPath)) {
            this.registerActive = true;
        }
    }

    resetActive() {
        this.loginActive = false;
        this.registerActive = false;
    }

    headerNavigateToLogin() {
        // this.router.navigate([{outlets: {auth: 'accounts/login'}}]);
        let progressSpinnerModel = new ProgressSpinnerModel(true, true);
        this.eventService.setMainProgressSpinner(progressSpinnerModel);
        this.oidcService.loginOIDC()
            .then(_ => {
                setTimeout(() => {
                let progressSpinnerModel1 = new ProgressSpinnerModel(false, false);
                this.eventService.setMainProgressSpinner(progressSpinnerModel1);
                }, 5000)
            })
            .catch(err => {
                let progressSpinnerModel1 = new ProgressSpinnerModel(false, false);
                this.eventService.setMainProgressSpinner(progressSpinnerModel1);
            });
    }

    headerNavigateToRegister() {
        this.router.navigate([{outlets: {auth: 'accounts/register'}}]);
        // this.router.navigate(['accounts/register'])
    }
}
