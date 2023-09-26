import { Action } from '@ngrx/store';
import { NotificationViewModel } from '../models/NotificationViewModel';

export enum NotificationsActionTypes {
    GET_NOTIFICATIONS = '[Notifications] Get Notifications',
    ADD_NOTIFICATIONS = '[Notifications] Add Notifications',
    UPDATE_NOTIFICATIONS_VIEWED = '[Notifications] Update Notifications Viewed',
    UPDATE_NOTIFICATIONS = '[Notifications] Update Notifications',

    GET_NEW_NOTIFICATIONS = '[Notifications] Get New Notifications',
    ADD_NEW_NOTIFICATIONS = '[Notifications] Add New Notifications',
    REMOVE_NOTIFICATIONS = '[Notifications] Remove Notifications',
    ADD_NOTIFICATION = '[Notifications] Add Notification',
    UPDATE_NOTIFICATION = '[Notifications] Update Notification',
    REMOVE_NOTIFICATION = '[Notifications] Remove Notification'
}

export class GetNotifications implements Action {
    readonly type = NotificationsActionTypes.GET_NOTIFICATIONS;
    constructor(public payload: number) {}
}

export class AddNotifications implements Action {
    readonly type = NotificationsActionTypes.ADD_NOTIFICATIONS;
    constructor(public payload: NotificationViewModel[]) {}
}

export class UpdateNotifications implements Action {
    readonly type = NotificationsActionTypes.UPDATE_NOTIFICATIONS;
    constructor(public payload: NotificationViewModel[]) {}
}

export class UpdateNotificationsViewed implements Action {
    readonly type = NotificationsActionTypes.UPDATE_NOTIFICATIONS_VIEWED;
    constructor(public payload: NotificationViewModel[]) {}
}

export class GetNewNotifications implements Action {
    readonly type = NotificationsActionTypes.GET_NEW_NOTIFICATIONS;
    constructor(public totalCount: number) {}
}

export class AddNewNotifications implements Action {
    readonly type = NotificationsActionTypes.ADD_NEW_NOTIFICATIONS;
    constructor(public newNotifications: NotificationViewModel[]) {}
}

export class RemoveNotifications implements Action {
    readonly type = NotificationsActionTypes.REMOVE_NOTIFICATIONS;
}

export class AddNotification implements Action {
    readonly type = NotificationsActionTypes.ADD_NOTIFICATION;
}

export class UpdateNotification implements Action {
    readonly type = NotificationsActionTypes.UPDATE_NOTIFICATION;
}

export class RemoveNotification implements Action {
    readonly type = NotificationsActionTypes.REMOVE_NOTIFICATION;
    constructor(public notificationId: string) {}
}

export type All =
    | GetNotifications
    | AddNotifications
    | UpdateNotificationsViewed
    | UpdateNotifications
    | AddNewNotifications
    | RemoveNotifications
    | AddNotification
    | UpdateNotification
    | RemoveNotification;


