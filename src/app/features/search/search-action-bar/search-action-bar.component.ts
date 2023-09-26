import { Component, OnInit, Output, EventEmitter, Renderer2,
    OnDestroy, ViewEncapsulation, ViewChild, Input, ChangeDetectionStrategy,
    ChangeDetectorRef } from '@angular/core';
import { config } from '../../../../config/config';
import { EventService } from '../../../services/utility/event.service';
import { snackBarConfig } from '../../../../config/snackBarConfig';
import { Location } from '@angular/common';
import { BaseNavigationComponent } from '../../navigation/base-navigation/base-navigation.component';
import { Router, ActivatedRoute, ActivationEnd } from '@angular/router';
import { AccountsEventsService } from '../../accounts/accounts-events.service';
import { Observable, Subscription } from 'rxjs';
import { UtilityService } from '../../../services/utility/utility.service';
import { SaveSearchResultModel } from '../SaveSearchResultModel';
import { Store } from '@ngrx/store';
import { AppState, selectCurrentSearchState, selectSavedSearchesState, selectSearchFormState } from '../../../store/app.state';
import { SearchFormModel } from '../SearchFormModel';
import { CurrentSearchModel } from '../CurrentSearchModel';
import { SearchService } from '../search.service';
import { ChangeSearch, ChangeSearchFormOpen } from '../../../store/actions/search-form.actions';
import { TooltipPosition } from '@angular/material/tooltip';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';

@Component({
    selector: 'app-search-action-bar',
    templateUrl: './search-action-bar.component.html',
    styleUrls: ['search-action-bar.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchActionBarComponent extends BaseNavigationComponent implements OnInit, OnDestroy {
    @Input() userAuthenticated: boolean;

    getSavedSearchesStateSub: Subscription;
    getSavedSearchesState: Observable<SaveSearchResultModel[]>;
    saveSearchResults: SaveSearchResultModel[] = [];

    getSearchFormStateSub: Subscription
    getSearchFormState: Observable<SearchFormModel>;
    searchForm: SearchFormModel = new SearchFormModel(false, '', [], false);


    getCurrentSearchStateSub: Subscription;
    getCurrentSearchState: Observable<CurrentSearchModel>;
    currentSearch: CurrentSearchModel;

//#region Labels
    backLabel = config.labels.navigationMenu.back;
    searchLabel = config.labels.searchBox.search;
    closeLabel = config.labels.searchBox.close;
    clearLabel = config.labels.searchBox.clear;
    openLabel = config.labels.searchBox.open;
//#endregion Labels


    viewLabelClass = 'open-saved-search-disabled';
    openLabelClass = 'open-saved-search-disabled';
    saveLabelClass = 'open-saved-search-disabled'
    searchButtonClass = 'search-action-search';
    searchButtonTooltip = config.tooltips.search;
    buttonTooltipPosition: TooltipPosition = 'above';

    saveTooltip = config.tooltips.save;
    shareTooltip = config.tooltips.shareTooltip;


    searchActive = false;
    saveSearchEnabled = false;

    viewSectionSubscription: Subscription;
    isViewSection = false;

    @ViewChild('searchMenuTrigger', {static: false}) searchMenuTrigger: MatMenuTrigger;
    @ViewChild('searchMenu', {static: false}) searchMenu: MatMenu;

    buttonTooltipClass = ['search-button-action-bar-tooltip'];


    _utilityService: UtilityService;

    constructor(
        private store: Store<AppState>,
        private searchService: SearchService,
        router: Router,
        private eventService: EventService,
        route: ActivatedRoute,
        private renderer2: Renderer2,
        utilityService: UtilityService,
        private changeDetectorRef: ChangeDetectorRef
    ) {
        super(
            utilityService
        )
        this.getSavedSearchesState = this.store.select(selectSavedSearchesState);
        this.getSearchFormState = this.store.select(selectSearchFormState);
        this.getCurrentSearchState = this.store.select(selectCurrentSearchState);

        this._utilityService = utilityService;

     }

    ngOnInit(): void {
        // this.marginTooltipClass.push('search-action-bar-margin-tooltip');

        this.getSavedSearchesStateSub = this.getSavedSearchesState.subscribe((savedSearches) => {
            this.saveSearchResults = savedSearches;
            if (this.saveSearchResults && this.saveSearchResults.length > 0) {
                this.openLabelClass = '';
            } else {
                this.openLabelClass = 'open-saved-search-disabled';
            }
        });

        this.getSearchFormStateSub = this.getSearchFormState.subscribe((searchForm) => {

            this.setSearchActive(searchForm);

            this.setSaveSearchEnabled(searchForm);

            this.searchForm = searchForm;
            this.changeDetectorRef.detectChanges();
        });

        this.getCurrentSearchStateSub = this.getCurrentSearchState.subscribe((currentSearch) => {
            this.currentSearch = currentSearch;
            this.searchActive = this.searchService.isSearchActive(this.searchForm, this.currentSearch);
            if (!this.changeDetectorRef['destroyed']) {
                this.changeDetectorRef.detectChanges();
            }
        });


        this.isViewSection = this.eventService.getViewSectionBehavior().getValue();
        this.setViewSection(this.isViewSection);
        this.viewSectionSubscription = this.eventService.getViewSection()
            .subscribe(data => {
                this.isViewSection = data;
                this.setViewSection(data);
                this.changeDetectorRef.detectChanges();
            });
    }


    private setSaveSearchEnabled(searchForm: SearchFormModel) {
        if (searchForm.input && searchForm.input.trim() !== '' || searchForm.selectedTags.length > 0) {
            if (!this.saveSearchEnabled) {
                this.saveLabelClass = '';
                this.saveSearchEnabled = true;
            }
        } else {
            if (this.saveSearchEnabled) {
                this.saveLabelClass = 'open-saved-search-disabled';
                this.saveSearchEnabled = false;
            }
        }
    }

    private setSearchActive(searchForm: SearchFormModel) {
        const searchActive = this.searchService.isSearchActive(
            searchForm, this.currentSearch
        );

        if (searchActive !== this.searchActive) {
            this.searchActive = searchActive;
        }
    }

    setViewSection(isViewSection: boolean) {
        if (isViewSection) {
            this.viewLabelClass = '';
        } else {
            this.viewLabelClass = 'open-saved-search-disabled';
        }
        this.changeDetectorRef.detectChanges();
    }


    ngOnDestroy(): void {

        if (this.getSavedSearchesStateSub) {
            this.getSavedSearchesStateSub.unsubscribe();
        }

        if (this.getSearchFormStateSub) {
            this.getSearchFormStateSub.unsubscribe();
        }

        if (this.getCurrentSearchStateSub) {
            this.getCurrentSearchStateSub.unsubscribe();
        }

        if (this.viewSectionSubscription) {
            this.viewSectionSubscription.unsubscribe();
        }
    }

    closeSearch() {
        this.store.dispatch(new ChangeSearchFormOpen(false));
    }

    doSearch() {
        this.store.dispatch(new ChangeSearch(true));
    }

    clearSearch() {
    }

    saveSearch() {
        this.searchService.openSaveSearchDialog();
    }

    onMenuOpen(event) {
        // event.preventDefault();
        this._utilityService.setFixedScrollPosition(this.renderer2);
        setTimeout(() => {
            this.searchMenuTrigger.openMenu();
            let el = document.getElementsByClassName('search-menu')[0].parentElement;
            this.renderer2.setStyle(el, 'width', '100%');
            this.renderer2.setStyle(el, 'right', '0');


            // this._renderer2.setStyle(el, 'bottom', '50px');

            // 'calc(100vh - 88px)');

        }, 100)

        setTimeout(() => {
            let el = document.getElementsByClassName('search-menu')[0].parentElement;
            this.renderer2.setStyle(el, 'height', window.innerHeight - 88 + 'px');
            this.renderer2.setStyle(el, 'position', 'fixed');
            this.renderer2.setStyle(el, 'top', '0');
            this.renderer2.setStyle(el.parentElement, 'top', '0');

        }, 300)

    }

    onMenuClose() {
        this._utilityService.removeFixedScrollPosition(this.renderer2);
        // setTimeout(() => {
        //     let el = document.getElementsByClassName('cdk-overlay-pane')[0];
        //     this._renderer2.removeStyle(el, 'width');
        // }, 0)

    }

}
