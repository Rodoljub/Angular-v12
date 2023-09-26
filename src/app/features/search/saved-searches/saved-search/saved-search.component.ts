import { Component, OnInit, Input, AfterViewInit, Inject, PLATFORM_ID, ViewChild, EventEmitter, Output } from '@angular/core';
import { config } from '../../../../../config/config';
import { isPlatformBrowser } from '@angular/common';
import { ItemViewModel } from '../../../items/item/ItemViewModel';
import { SaveSearchResultModel } from '../../SaveSearchResultModel';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/app.state';
import { AddSearchForm } from '../../../..//store/actions/search-form.actions';
import { SearchFormModel } from '../../SearchFormModel';
import { SearchService } from '../../search.service';
// import { MatRipple } from '@angular/material/core';
import { TooltipPosition } from '@angular/material/tooltip';

@Component({
    selector: '[app-saved-search]',
    templateUrl: './saved-search.component.html'
})
export class SavedSearchComponent implements OnInit, AfterViewInit {
    @Input() saveSearchResult: SaveSearchResultModel;
    @Input() saveSearchResults: SaveSearchResultModel[] = [];
    @Input() index;
    @Input() isMobileView;

    @Output() savedSearchEmitter = new EventEmitter<SaveSearchResultModel>();


    item: ItemViewModel;

    // @ViewChild(MatRipple, {static: false}) ripple: MatRipple;


    actionIconClass = 'saved-search-action-icon';
    editTooltip = config.tooltips.editTooltip;
    shareTooltip = config.tooltips.shareTooltip;
    deleteTooltip = config.tooltips.delete;
    aboveTooltipPosition: TooltipPosition = 'above';

    actionType = config.actionIconTypes.edit;
    actionEditType = config.actionIconTypes.edit;
    actionDeleteType = config.actionIconTypes.delete;

    constructor(
        private store: Store<AppState>,
        private searchService: SearchService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.item = new ItemViewModel
            this.item.Tags = this.saveSearchResult.searchTags;

            // this.saveSearchResult.index = this.index;
        }
    }

    ngAfterViewInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            // this.ripple.disabled = true;
        }
    }

    openSavedSearchResalt() {
        // this.ripple.disabled = false;
        // this.ripple.launch({centered: true})
        // this.matRippleAttribut = 'matRipple'

        const input = this.saveSearchResult.searchText || '';
        const searchForm = new SearchFormModel(
            true,
            input,
            this.saveSearchResult.searchTags,
            true
        )
        this.store.dispatch(new AddSearchForm(searchForm))

    }

    onSetActionType(event) {
        switch (event) {
            case config.actionIconTypes.edit:
                this.saveSearchEdit();
                break;

            case config.actionIconTypes.delete:
                this.saveSearchDelete();
                break;
            default:
                break;
        }
    }

    saveSearchEdit() {
        this.openSavedSearchResalt();
    }

    saveSearchDelete(event?) {
        this.savedSearchEmitter.emit(this.saveSearchResult);
    }

}
