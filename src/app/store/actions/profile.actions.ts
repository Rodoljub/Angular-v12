import { Action } from '@ngrx/store';
import { AnalyzingImageModel } from '../../features/upload/models/AnalyzingImageModel';
import { ProfileDetailsModel } from '../../features/profile-details/ProfileDetailsModel';


export enum ProfileActionTypes {
    GET_PROFILE = '[Profile] Get Profile',
    ADD_PROFILE = '[Profile] Add Profile',
    REMOVE_PROFILE = '[Profile] Remove Profile',
    CHANGE_PROFILE_NAME = '[Profile] Change Profile Name',
    ADD_ANALYZING_IMAGE = '[Profile] Add AnalyzingI mage',
    REMOVE_ANALYZING_IMAGE = '[Profile] Remove Analyzing Image'
}

export class GetProfile implements Action {
    readonly type = ProfileActionTypes.GET_PROFILE;
    constructor() {}
}

export class AddProfile implements Action {
    readonly type = ProfileActionTypes.ADD_PROFILE;
    constructor(public payload: ProfileDetailsModel) {}
}

export class RemoveProfile implements Action {
    readonly type = ProfileActionTypes.REMOVE_PROFILE;
    constructor(public payload: any) {}
}

export class ChangeProfileName implements Action {
    readonly type = ProfileActionTypes.CHANGE_PROFILE_NAME;
    constructor(public payload: string) {}
}

export class AddAnalyzingImage implements Action {
    readonly type = ProfileActionTypes.ADD_ANALYZING_IMAGE;
    constructor(public payload: AnalyzingImageModel) {}
}

export class RemoveAnalyzingImage implements Action {
    readonly type = ProfileActionTypes.REMOVE_ANALYZING_IMAGE;
}


  export type All =
    | GetProfile
    | AddProfile
    | RemoveProfile
    | ChangeProfileName
    | AddAnalyzingImage
    | RemoveAnalyzingImage;
