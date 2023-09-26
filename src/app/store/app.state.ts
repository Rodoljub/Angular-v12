import { createFeatureSelector } from '@ngrx/store';
import { SaveSearchResultModel } from '../features/search/SaveSearchResultModel';
import { ProfileDetailsModel } from '../features/profile-details/ProfileDetailsModel';
import * as profile from './reducers/profile.reducer';
import * as savedSearches from './reducers/saved-searches.reducer';
import * as searchForm from './reducers/search-form.reducer';
import * as currentSearch from './reducers/current-search.reducer';
import * as mainSpinner from './reducers/main-spinner.reducer';
import * as notifications from '../features/notifications/store/notifications.reducer';
import * as upload from '../features/upload/store/upload.reducer';
import * as itemTags from '../features/items/item/item-tags/store/item-tags.reducer';
import * as listViewMode from '../features/items/items-list/store/list-view.reducer';
import { SearchFormModel } from '../features/search/SearchFormModel';
import { CurrentSearchModel } from '../features/search/CurrentSearchModel';
import { NotificationViewModel } from '../features/notifications/models/NotificationViewModel';
import { UploadStateModel } from '../features/upload/models/UploadStateModel';


export interface AppState {
  profile: ProfileDetailsModel | null,
  savedSearches: SaveSearchResultModel[] | null,
  searchForm: SearchFormModel,
  currentSearch: CurrentSearchModel,
  mainSpinner: boolean,
  notifications: NotificationViewModel[] | null,
  upload: UploadStateModel,
  itemTags: boolean,
  listViewMode: string
}

export const reducers = {
  profile: profile.reducer,
  savedSearches: savedSearches.reducer,
  searchForm: searchForm.reducer,
  currentSearch: currentSearch.reducer,
  mainSpinner: mainSpinner.reducer,
  notifications: notifications.reducer,
  upload: upload.reducer,
  itemTags: itemTags.reducer,
  listViewMode: listViewMode.reducer
}

export const selectProfileState = createFeatureSelector<ProfileDetailsModel>('profile');
export const selectSavedSearchesState = createFeatureSelector<SaveSearchResultModel[]>('savedSearches');
export const selectSearchFormState = createFeatureSelector<SearchFormModel>('searchForm');
export const selectCurrentSearchState = createFeatureSelector<CurrentSearchModel>('currentSearch');
export const selectMainSpinnerState = createFeatureSelector<boolean>('main-spinner');
export const selectNotificationsState = createFeatureSelector<NotificationViewModel[]>('notifications');
export const selectUploadState = createFeatureSelector<UploadStateModel>('upload');
export const selectItemTagsState = createFeatureSelector<boolean>('itemTags');
export const selectListViewModeState = createFeatureSelector<string>('listViewMode');
