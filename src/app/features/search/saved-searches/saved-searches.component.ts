import { Component, OnInit, Inject, PLATFORM_ID, HostListener, ChangeDetectorRef, Input } from '@angular/core';
import { SearchApiService } from '../../../services/rs/search-api.service';
import { UtilityService } from '../../../services/utility/utility.service';
import { EventService } from '../../../services/utility/event.service';
import { isPlatformBrowser } from '@angular/common';
import { snackBarConfig } from '../../../../config/snackBarConfig';
import { SnackBarService } from '../../common/snack-bar/snack-bar.service';
import { SaveSearchResultModel } from '../SaveSearchResultModel';
import { SnackBarModel } from '../../common/snack-bar/snack-bar-model';
import { MessageActionBarComponent } from '../../common/snack-bar/message-action-bar/message-action-bar.component';
import { MappingItem } from '../../../shared/mappingItem';
import { errorsConfig } from '../../../../config/errorsConfig';
import { configMessages } from '../../../../config/configMessages';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.state';
import { GetSavedSearches, RemoveSavedSearch } from '../../..//store/actions/saved-searches.actions';
import { SearchService } from '../search.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-saved-searches',
    templateUrl: './saved-searches.component.html'
})
export class SavedSearchesComponent implements OnInit {

@Input() saveSearchResults: SaveSearchResultModel[] = [];

tempDeletedSavedSearch: SaveSearchResultModel;


    isMobileView: boolean;
    snackbarRef: any;
    constructor(
        private store: Store<AppState>,
        public snackBar: MatSnackBar,
        private snackBarService: SnackBarService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        let resizeEventWidth = event.target.innerWidth;
        this.resize(resizeEventWidth)
    }

    resize(resizeEventWidth) {
        if (resizeEventWidth < 480) {
            this.isMobileView = true;
        } else {
            this.isMobileView = false;
        }
    }

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            let resizeEventWidth = document.scrollingElement.clientWidth;
            this.resize(resizeEventWidth);

            // let progressSpinnerModel = new ProgressSpinnerModel(false, false);
            // this._eventService.setMainProgressSpinner(progressSpinnerModel);

        }

    }

    trackByItems(index, saveSearchResult: SaveSearchResultModel) {
        return saveSearchResult; // or item.id
    }

    onDeleteSaveSR(savedSearch) {
        this.setDeleteSnackBar(savedSearch);

    }

    setDeleteSnackBar(savedSearch) {
        let snackBarModel = new SnackBarModel(
          snackBarConfig.message.undoAction,
          snackBarConfig.type.delete,
          snackBarConfig.action.undo,
          [].concat(savedSearch.id)
        );

        const configDuration = snackBarConfig.snackBarDurationUndo;

        let matSnackBarConfig = this.snackBarService.setMatSnackBarConfig(snackBarModel, configDuration);

        this.snackbarRef = this.snackBar.openFromComponent(MessageActionBarComponent, matSnackBarConfig)
        .afterDismissed()
        .subscribe(data => {
            if (!data.dismissedByAction) {
                this.store.dispatch(new RemoveSavedSearch(savedSearch.id))
                this.store.dispatch(new GetSavedSearches());
            } else {
                this.snackBarService.popMessageSuccess('Undo Successful')
            }
        })
    }
}
