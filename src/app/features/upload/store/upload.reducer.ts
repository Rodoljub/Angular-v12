import { UploadStateModel } from '../../../features/upload/models/UploadStateModel';
import { AllUploadsActions, UploadActionTypes } from './upload.actions';


export const initialState: UploadStateModel = new UploadStateModel(false, undefined, [], []);

export function reducer(state = initialState, action: AllUploadsActions): UploadStateModel {
    switch (action.type) {

        case UploadActionTypes.ADD_UPLOAD_STATE: {
            return action.uploadState;
        }

        case UploadActionTypes.REMOVE_UPLOAD_STATE: {
            return initialState;
        }

        case UploadActionTypes.CHANGE_UPLOAD_OPEN: {
            return state;
        }

        case UploadActionTypes.ADD_ANALYZING_IMAGES: {
            return {
                ...state,
                analyzingImages: action.analyzingImages
            }
        }

        case UploadActionTypes.ADD_ANALYZING_IMAGE: {
            return {
                ...state,
                analyzingImages: [...state.analyzingImages].concat(action.analyzingImage)
            }
        }

        case UploadActionTypes.REMOVE_ANALYZING_IMAGE: {
            return {
                ...state,
                analyzingImages: state.analyzingImages
                    .filter(ai => ai.fileId !== action.analyzingImage.fileId)
            }
        }

        default: {
            return state;
        }

    }
}
