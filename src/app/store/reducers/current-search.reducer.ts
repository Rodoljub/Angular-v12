import { CurrentSearchModel } from '../../features/search/CurrentSearchModel';
import { All, CurrentSearchActionTypes } from '../actions/current-search.actions';



export const initialState: CurrentSearchModel = new CurrentSearchModel('', []);

export function reducer(state = initialState, action: All): CurrentSearchModel {

    switch (action.type) {
        case CurrentSearchActionTypes.ADD_CURRENT_SEARCH:
            return {...action.payload};

        case CurrentSearchActionTypes.REMOVE_CURRENT_SEARCH:
            return {...initialState};
        default:
            return state;
    }
}
