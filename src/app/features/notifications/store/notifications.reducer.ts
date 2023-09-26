import { NotificationViewModel } from '../models/NotificationViewModel';
import { All, NotificationsActionTypes } from './notifications.actions';



export const initialState: NotificationViewModel[] = null;

export function reducer(state = initialState, action: All): NotificationViewModel[] {
    switch (action.type) {

        case NotificationsActionTypes.ADD_NOTIFICATIONS: {
            return action.payload

            // return {
            //     ...state.concat(action.payload)
            // }
        }

        case NotificationsActionTypes.UPDATE_NOTIFICATIONS: {
            return action.payload
        }

        case NotificationsActionTypes.ADD_NEW_NOTIFICATIONS: {
            if (Array.isArray(action.newNotifications)) {
                return action.newNotifications.concat(state);
            } else {
                return state;
            }
        }

        case NotificationsActionTypes.REMOVE_NOTIFICATIONS: {
            return initialState;
        }

        case NotificationsActionTypes.ADD_NOTIFICATION: {
            break;
        }

        case NotificationsActionTypes.UPDATE_NOTIFICATION: {
            break;
        }

        case NotificationsActionTypes.REMOVE_NOTIFICATION: {
            break;
        }

        default: {
            return state;
        }
    }
}

