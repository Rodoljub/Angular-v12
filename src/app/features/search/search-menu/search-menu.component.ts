import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter,
  ViewEncapsulation, OnChanges, SimpleChanges, Renderer2, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { config } from '../../../../config/config';
import { UtilityService } from '../../../services/utility/utility.service';
import { SaveSearchResultModel } from '../SaveSearchResultModel';
import { Store } from '@ngrx/store';
import { AppState, selectSavedSearchesState } from '../../../store/app.state';
import { Observable, Subscription } from 'rxjs';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';

@Component({
    selector: 'app-search-menu',
    templateUrl: 'search-menu.component.html',
    styleUrls: ['search-menu.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class SearchMenuComponent implements OnInit, OnChanges, OnDestroy {
  getSavedSearchesStateSub: Subscription;
  getSavedSearchesState: Observable<SaveSearchResultModel[]>;
  saveSearchResults: SaveSearchResultModel[] = [];

    @Input() searchControlValue = '';
    @Input() selectedTags = [];

    @Input() saveSearchEnable = false

    searchMenuDisabled = false;

    loadSavedSearch = true;

    @ViewChild('searchMenuTrigger', {static: false}) searchMenuTrigger: MatMenuTrigger;
    @ViewChild('searchMenu', {static: false}) searchMenu: MatMenu;


    constructor(
      private store: Store<AppState>,
      private utilityService: UtilityService,
      private renderer2: Renderer2,
      private changeDetectorRef: ChangeDetectorRef
    ) {
      this.getSavedSearchesState = this.store.select(selectSavedSearchesState);
     }

    ngOnInit() {this.setSearchMenu()}

    ngOnChanges(changes: SimpleChanges) {
      // this.setSearchMenu();
    }

    ngOnDestroy(): void {
      if (this.getSavedSearchesStateSub) {
        this.getSavedSearchesStateSub.unsubscribe();
      }
    }

  private setSearchMenu() {
    this.getSavedSearchesStateSub = this.getSavedSearchesState.subscribe((savedSearches) => {
      this.saveSearchResults = savedSearches;

      if (this.saveSearchResults && this.saveSearchResults.length > 0) {
        this.loadSavedSearch = true;
      } else {
        this.loadSavedSearch = false;
      }
    })

    if (this.saveSearchEnable) {
      this.searchMenuDisabled = false;
    } else {
      this.searchMenuDisabled = true;
    }
  }

      onMenuOpen() {
        let element = document.getElementById('header');
        let elementBottom = element.getBoundingClientRect().bottom;

        let inputEl = document.getElementById('search-mat-form-field');
        const inputElBound = inputEl.getBoundingClientRect();

        let panel = document.getElementsByClassName('search-menu')[0].parentElement;
        setTimeout(() => {
          this.renderer2.setStyle(panel, 'top', elementBottom + 'px');
          this.renderer2.setStyle(panel, 'width', inputElBound.width + 48 + 'px');
          this.renderer2.setStyle(panel, 'left', inputElBound.left + 'px');
        }, 0)

        this.utilityService.setFixedScrollPosition(this.renderer2);
      }

      onMenuClose() {
        this.utilityService.removeFixedScrollPosition(this.renderer2);
      }

}
