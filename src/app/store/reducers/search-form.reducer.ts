
import { SearchFormModel } from '../../features/search/SearchFormModel';
import { All, SearchFormActionTypes } from '../actions/search-form.actions';


export const initialState: SearchFormModel = new SearchFormModel(false, '', [], false);




export function reducer(state = {...initialState}, action: All): SearchFormModel {

    // if (state === null) {
    //     state = initialState
    // }
    switch (action.type) {
        case SearchFormActionTypes.ADD_SEARCH_FORM: {
            const distinctSelectedTags = action.payload.selectedTags.
            filter((value, index, tags) => tags.indexOf(value) === index);
            return {...action.payload, selectedTags: distinctSelectedTags};
        }

        case SearchFormActionTypes.REMOVE_SEARCH_FORM: {
            return initialState;
        }

        case SearchFormActionTypes.CHANGE_SEARCH_FORM_OPEN: {
            return {...state, searchFormOpen: action.payload};
        }

        case SearchFormActionTypes.CHANGE_INPUT_CHARS: {
            return {...state, input: action.payload};
        }

        case SearchFormActionTypes.ADD_SELECTED_TAG: {
            const isTagSelected = state.selectedTags.find(t => t === action.payload);
            if (isTagSelected) {
                return {...state};
            } else {
                return {...state, selectedTags: [...state.selectedTags, action.payload]};
            }
        }

        case SearchFormActionTypes.ADD_SELECTED_TAGS: {
            return {...state, selectedTags: [...state.selectedTags].concat(action.payload)};
        }

        case SearchFormActionTypes.REMOVE_SELECTED_TAG: {
            return {...state, selectedTags: state.selectedTags.filter(t => t !== action.payload)};
        }

        case SearchFormActionTypes.CHANGE_SEARCH: {
            return {...state, search: action.payload};
        }

        default: {
            switch (state) {
                case null: {
                    return {...initialState};
                }

                default: {
                    return {...state};
                }
            }
        }
    }
}
