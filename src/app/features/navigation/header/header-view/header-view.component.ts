
import { Component, OnInit, Inject, PLATFORM_ID, Input, OnDestroy } from '@angular/core';
import { localStorageConfig } from '../../../../../config/localStorageConfig';
import { config } from '../../../../../config/config';
import { EventService } from '../../../..//services/utility/event.service';
import { isPlatformBrowser } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { ProgressSpinnerModel } from '../../../common/progress-loaders/progress-spinner/ProgressSpinnerModel';
import { Store } from '@ngrx/store';
import { AppState, selectListViewModeState } from 'src/app/store/app.state';
import { ChangeListViewState } from 'src/app/features/items/items-list/store/list-view.actions';

@Component({
    selector: 'app-header-view',
    templateUrl: './header-view.component.html'
})

export class HeaderViewComponent implements OnInit, OnDestroy {
    @Input() header = true;
    @Input() isViewSection = false;

    gridViewType = config.listViewTypes.grid;
    wallViewType = config.listViewTypes.wall;

    listViewModeStateSub: Subscription;
    getlistViewModeState: Observable<string>;
    listViewModeState: string;

    currentViewType = config.listViewTypes.wall;

    viewLabel = config.tooltips.view;
    viewIcon: string;
    viewGrid = 'viewGrid';
    viewStream = 'viewStream';


    changeViewLoading = false;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private eventService: EventService,
        private store: Store<AppState>
    ) {
        this.getlistViewModeState = this.store.select(selectListViewModeState);
     }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.listViewModeStateSub = this.getlistViewModeState.subscribe(
                listViewMode => {
                    this.listViewModeState = listViewMode;
                    this.setViewModule();                 
                }
            )
        }
     }

     ngOnDestroy(): void {
         if (isPlatformBrowser(this.platformId)) {
            if (this.listViewModeStateSub) {
                this.listViewModeStateSub.unsubscribe();
            }
         }
     }

    setViewModule() {
        switch (this.listViewModeState) {
            case this.gridViewType:
                this.viewIcon = this.viewStream;
              break;
            case this.wallViewType:
                this.viewIcon = this.viewGrid;
              break;
            default:
              break;
          }     
    }  

    changeCurrentViewType() {
        // event.preventDefault();
        if (!this.changeViewLoading && this.isViewSection) {
            this.changeViewLoading = true;
            this.setProgressSpinner();

            setTimeout(() => {
            switch (this.listViewModeState) {
                case this.gridViewType:
                    this.store.dispatch(new ChangeListViewState(this.wallViewType));
                // this.setWallViewType();
                break;
                case this.wallViewType:
                    this.store.dispatch(new ChangeListViewState(this.gridViewType));
                // this.setGridViewType();
                break;
                default:
                break;
            }

            // this.eventService.setItemListViewMode(this.currentViewType);
            this.changeViewLoading = false;
            }, 0)

        } else {
            // event.stopImmediatePropagation();
        }
    }

    private setProgressSpinner() {
        let progressSpinnerModel = new ProgressSpinnerModel(true, true);
        this.eventService.setMainProgressSpinner(progressSpinnerModel);
    }
}
