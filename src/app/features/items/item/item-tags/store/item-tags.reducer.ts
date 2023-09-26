import { AllItemTagsActions, ItemTagsActionTypes } from "./item-tags.actions";


export const initialState: boolean = false;

export function reducer(state = initialState, action: AllItemTagsActions): boolean {
    switch (action.type) {

        case ItemTagsActionTypes.CHANGE_ITEM_TAGS_STATE: {
            return action.isOpen;
        }

        default: {
            return state;
        }
    }
}