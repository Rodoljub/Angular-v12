import { Component, OnInit, Inject, PLATFORM_ID, Input } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';

import { config } from '../../../../../config/config';

@Component({
    selector: 'app-header-desktop',
    templateUrl: 'header-desktop.component.html',
})

export class HeaderDesktopComponent implements OnInit {
    @Input() userAuthenticated: boolean;

    homeNavigationLabel = config.labels.navigation.home;
    favouritesNavigationLabel = config.labels.navigation.favourites;
    portfolioNavigationLabel = config.labels.navigation.portfolio;

    homeActive = false;
    favourivesActive = false;
    portfolioActive = false;

    homePath = config.routeConfigPath.home;
    favouritesPath = config.routeConfigPath.favourites;
    portfolioPath = config.routeConfigPath.portfolio;

    uploadTooltip = config.tooltips.upload;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private router: Router,
        private location: Location
    ) { }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.routerEvents();
            this.setActive(location.pathname.slice(1));
        }
    }

    routerEvents() {
        this.router.events.subscribe((evt: ActivationEnd) => {

            if (!(evt instanceof ActivationEnd)) {
              return;
            }
            console.log('header-desktop:' + evt)
            this.setActive(evt.snapshot.routeConfig.path);

        });
    }

    navigateTo(path: string) {
        this.router.navigate([path]);
    }

    setActive(path: string) {
        this.resetActive();
        switch (path) {
            case this.homePath:
                this.homeActive = true;
                break;

            case this.favouritesPath:
                this.favourivesActive = true;
                break;

            case this.portfolioPath:
                this.portfolioActive = true;
                break;

            default:
                break;
        }
    }

    resetActive() {
        this.homeActive = false;
        this.favourivesActive = false;
        this.portfolioActive = false;
    }
}
