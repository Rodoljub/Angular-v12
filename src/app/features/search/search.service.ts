import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { MappingItem } from '../../shared/mappingItem';
import { AddSavedSearch, GetSavedSearches, RemoveSavedSearch, UpdateSavedSearch } from '../../store/actions/saved-searches.actions';
import { AddSearchForm } from '../../store/actions/search-form.actions';
import { AppState } from '../../store/app.state';
import { configMessages } from '../../../config/configMessages';
import { errorsConfig } from '../../../config/errorsConfig';
import { snackBarConfig } from '../../../config/snackBarConfig';
import { config } from '../../../config/config';
import { MatDialogComponent } from '../common/mat-dialog/mat-dialog.component';
import { MessageActionBarComponent } from '../common/snack-bar/message-action-bar/message-action-bar.component';
import { SnackBarModel } from '../common/snack-bar/snack-bar-model';
import { SnackBarService } from '../common/snack-bar/snack-bar.service';
import { CurrentSearchModel } from './CurrentSearchModel';
import { SaveSearchModel } from './SaveSearchModel';
import { SaveSearchResultModel } from './SaveSearchResultModel';
import { SearchFormModel } from './SearchFormModel';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

@Injectable({providedIn: 'root'})

export class SearchService {

    snackbarRef

    constructor(
      public snackBar: MatSnackBar,
      private store: Store<AppState>,
      private matDialog: MatDialog,
      private snackBarService: SnackBarService

    ) {}

    setClientWidthType(clientWidth: number): string {

        const smallBrake = config.clientWidthBrake.small;
        const middelBrake = config.clientWidthBrake.middel;

        const smallView = config.clientWidthTypes.small;
        const middelView = config.clientWidthTypes.middel;
        const wideView = config.clientWidthTypes.wide;

        let clientType: string;

        if (clientWidth < smallBrake) { clientType = smallView } else
        if (clientWidth >= smallBrake && clientWidth < middelBrake) { clientType = middelView} else
        if (clientWidth >= middelBrake) { clientType = wideView }

        return clientType;
    }

    searchQueryChanged(query: string) {

      let splitSearchValue: string[] = query.split(',');

      let input = '';
      let selectedTags = [];

      for (let tag of splitSearchValue ) {
        if (tag.trim() !== '') {
          if (tag.startsWith('#')) {
            selectedTags.push(tag.split('#')[1].toLowerCase());
          } else {
            input = input.concat(tag + ' ');
          }
        }
      }

      const searchForm = new SearchFormModel(true, input.trim(), selectedTags, false);

      this.store.dispatch(new AddSearchForm(searchForm));

    }

    setSearchQuery(searchForm: SearchFormModel): string {

      let searchQuery = '';

        for (let name of searchForm.selectedTags) {
          searchQuery = searchQuery.concat('#' + name.toLowerCase() + ',');
        }

        if (searchForm.input && searchForm.input !== '') {
          if (searchForm.input.trim() !== '') {
            if (searchQuery.trim() === '') {
              searchQuery = searchQuery.concat(searchForm.input);
            } else {
              searchQuery = searchQuery.concat(searchForm.input + ',');
            }
          }
        }

        let last = searchQuery.slice(-1);
        if (last === ',') {
          searchQuery.slice(0, -1);
        }

        return searchQuery.trim();
    }

    isSearchActive(searchForm: SearchFormModel, currentSearch: CurrentSearchModel): boolean {
      if (!!searchForm && !!currentSearch) {
        if (searchForm.input === '' && searchForm.selectedTags.length === 0) {
          return false;
        }

        if (
            currentSearch.input === searchForm.input
        ) {
          if (currentSearch.selectedTags.length === searchForm.selectedTags.length
            && currentSearch.selectedTags.every(e => searchForm.selectedTags.indexOf(e) > -1)) {
              return false
            }
        }

        return true;
      }
      return false;
    }


    openSaveSearchDialog() {

      const dialogType = config.dialog.type.saveSearch;

      let matDialogRef = this.matDialog.open(MatDialogComponent, {
        data: {
          dialogType,
        }
      });

      matDialogRef.afterClosed().subscribe((result: SaveSearchResultModel) => {
        if (result) {
          if (result.id) {
            this.updateSearch(result);
          } else {
            const searchForm = new SearchFormModel(false, result.searchText, result.searchTags, false);
            const searchQuery = this.setSearchQuery(searchForm);
            const saveSearchModel = new SaveSearchModel(result.title, searchQuery);
            this.insertSearch(saveSearchModel);
          }
        }
      })
    }

    private insertSearch(saveSearchModel: SaveSearchModel) {
      this.store.dispatch(new AddSavedSearch(saveSearchModel));
      // this.store.dispatch(new GetSavedSearches());
    }

    private updateSearch(savedSearch: SaveSearchResultModel) {
      this.store.dispatch(new UpdateSavedSearch(savedSearch));
      // this.store.dispatch(new GetSavedSearches());
    }




    errorResult(respError: any): any {
      let errorMapping: Array<MappingItem> = [
        new MappingItem(errorsConfig.search.ErrorSaveSearchTitleExist, configMessages.search.ErrorSaveSearchTitleExist),
        new MappingItem(errorsConfig.search.ErrorExistingSaveSearch, configMessages.search.ErrorExistingSaveSearch)
      ];
      // this.commonResponseService.dispalyErrorMessages(respError, this, errorMapping, 1);
      return respError
    }
}
