import { Action } from '@ngrx/store';
import { AnalyzingImageModel } from '../../../features/upload/models/AnalyzingImageModel';
import { UploadStateModel } from '../../../features/upload/models/UploadStateModel';



export enum UploadActionTypes {
    ADD_UPLOAD_STATE = '[Upload] Add Upload State',
    REMOVE_UPLOAD_STATE = '[Upload] Remove Upload State',

    CHANGE_UPLOAD_OPEN = '[Upload] Change Upload Open',

    GET_ANALYZING_IMAGES = '[Upload] Get Analyzing Images',
    ADD_ANALYZING_IMAGES = '[Upload] Add Analyzing Images',

    ADD_ANALYZING_IMAGE = '[Upload] Add Analyzing Image',
    REMOVE_ANALYZING_IMAGE = '[Upload] Remove Analyzing Image'
}

export class AddUploadState implements Action {
    readonly type = UploadActionTypes.ADD_UPLOAD_STATE;
    constructor(public uploadState: UploadStateModel) {};
}

export class RemoveUploadState implements Action {
    readonly type = UploadActionTypes.REMOVE_UPLOAD_STATE;
    constructor() {}
}

export class ChangeUploadOpen implements Action {
    readonly type = UploadActionTypes.CHANGE_UPLOAD_OPEN;
    constructor() {}
}

export class GetAnalyzingImages implements Action {
    readonly type = UploadActionTypes.GET_ANALYZING_IMAGES;
    constructor() {};
}

export class AddAnalyzingImages implements Action {
    readonly type = UploadActionTypes.ADD_ANALYZING_IMAGES;
    constructor(public analyzingImages: AnalyzingImageModel[]) {};
}

export class AddAnalyzingImage implements Action {
    readonly type = UploadActionTypes.ADD_ANALYZING_IMAGE;
    constructor(public analyzingImage: AnalyzingImageModel) {};
}

export class RemoveAnalyzingImage implements Action {
    readonly type = UploadActionTypes.REMOVE_ANALYZING_IMAGE;
    constructor(public analyzingImage: AnalyzingImageModel) {};

}


export type AllUploadsActions =
    | AddUploadState
    | RemoveUploadState
    | ChangeUploadOpen
    | GetAnalyzingImages
    | AddAnalyzingImages
    | AddAnalyzingImage
    | RemoveAnalyzingImage;
