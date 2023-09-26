import { Action } from "@ngrx/store";


export enum ItemTagsActionTypes {
    CHANGE_ITEM_TAGS_STATE = '[ItemTags] Change Item Tags State'
}

export class ChangeItemTagsState implements Action {
    readonly type = ItemTagsActionTypes.CHANGE_ITEM_TAGS_STATE;
    constructor(public isOpen: boolean) {};
}

export type AllItemTagsActions =
    | ChangeItemTagsState;