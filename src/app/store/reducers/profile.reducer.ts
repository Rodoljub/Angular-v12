import { ProfileDetailsModel } from '../../features/profile-details/ProfileDetailsModel';
import { All, ProfileActionTypes } from '../actions/profile.actions';

// export interface ProfileState {
//     profile: ProfileDetailsModel | null
// }

export const initialState: ProfileDetailsModel = null;

export function reducer(state = initialState, action: All): ProfileDetailsModel {
    switch (action.type) {
        // case ProfileActionTypes.GET_PROFILE: {
        //     return {
        //         ...state
        //     };
        // }
        case ProfileActionTypes.ADD_PROFILE: {
            return {
                ...action.payload
            }
        }
        case ProfileActionTypes.REMOVE_PROFILE: {
            return initialState
        }

        case ProfileActionTypes.CHANGE_PROFILE_NAME: {
            return {
                ...state, name: action.payload
            }
        }

        default: {
            return state;
        }
    }
  }
