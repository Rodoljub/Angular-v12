import { SaveSearchResultModel } from '../../features/search/SaveSearchResultModel';

import { All, SavedSearchesActionTypes } from '../actions/saved-searches.actions';


export const initialState: SaveSearchResultModel[] = null;

export function reducer(state = initialState, action: All): SaveSearchResultModel[] {
    switch (action.type) {

        case SavedSearchesActionTypes.ADD_SAVED_SEARCHES: {
            return action.payload
        }
        case SavedSearchesActionTypes.REMOVE_SAVED_SEARCHES: {
            return initialState
        }
        default: {
            return state;
        }
    }
  }
