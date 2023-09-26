import { Component, OnInit, Inject, PLATFORM_ID, Input, OnDestroy, Output, EventEmitter, Renderer2 } from '@angular/core';
import { config } from '../../../../../config/config';
import { Router, ActivationEnd } from '@angular/router';
import { isPlatformBrowser, Location } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { EventService } from '../../../../services/utility/event.service';
import { snackBarConfig } from '../../../../../config/snackBarConfig';
import { UtilityService } from '../../../../services/utility/utility.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { AppState, selectSearchFormState } from '../../../../store/app.state';
import { SearchFormModel } from '../../../../features/search/SearchFormModel';
import { MatIconRegistry } from '@angular/material/icon';

@Component({
    selector: 'app-header-mobile',
    templateUrl: './header-mobile.component.html'
})

export class HeaderMobileComponent implements OnInit, OnDestroy {
    @Input() userAuthenticated: boolean;
    @Output() clickOnMenu = new EventEmitter();

    getSearchFormStateSub: Subscription;
    getSearchFormState: Observable<SearchFormModel>;
    searchForm: SearchFormModel = new SearchFormModel(false, '', [], false);

    homeLabel = config.tooltips.home;
    favouritesLabel = config.labels.navigation.favourites;
    portfolioLabel = config.tooltips.portfolio;
    menuLabel = config.labels.navigation.menu

    homeActive = false;
    favourivesActive = false;
    portfolioActive = false;

    homePath = config.routeConfigPath.home;
    favouritesPath = config.routeConfigPath.favourites;
    portfolioPath = config.routeConfigPath.portfolio;

    searchActionBarShowSubscription: Subscription;

    searchActionBar = false;

    actionBarShow = true;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        iconRegistry: MatIconRegistry, sanitizer: DomSanitizer,
        private router: Router,
        private location: Location,
        private eventService: EventService,
        private renderer2: Renderer2,
        private utilityService: UtilityService,
        private store: Store<AppState>
    ) {
        this.getSearchFormState = this.store.select(selectSearchFormState);

     }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.routerEvents();
            this.setActive(this.location.path().slice(1));

            this.getSearchFormStateSub = this.getSearchFormState.subscribe(searchForm => {
                if (this.searchForm.searchFormOpen !== searchForm.searchFormOpen) {
                    if (!searchForm.searchFormOpen) {
                        this.searchActionBar = false;
                    } else {
                        this.searchActionBar = true;
                    }
                }
                this.searchForm = searchForm;
            });


            this.searchActionBarShowSubscription = this.eventService.getBottomMobileNavActionShowShow()
            .subscribe(visible => {
                if (visible) {
                    this.actionBarShow = visible;
                } else {
                    this.actionBarShow = visible;
                }
            });
        }
     }

    ngOnDestroy() {
        if (this.getSearchFormStateSub) {
            this.getSearchFormStateSub.unsubscribe();
        }

        if (this.searchActionBarShowSubscription) {
            this.searchActionBarShowSubscription.unsubscribe();
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

    openMenu() {
        this.clickOnMenu.emit();
        this.utilityService.setFixedScrollPosition(this.renderer2);
    }
}
