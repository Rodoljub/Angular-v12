import { config } from "src/config/config";
import { AllListViewActions, ListViewActionTypes } from "./list-view.actions";


export const initialState: string = config.listViewTypes.wall;

export function reducer(state = initialState, action: AllListViewActions): string {
    switch (action.type) {

        case ListViewActionTypes.CHANGE_LIST_VIEW_STATE: {
            return action.viewType;
        }

        default: {
            return state;
        }
    }
}