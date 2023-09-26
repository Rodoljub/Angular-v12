import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { NotificationApiService } from '../../../services/rs/notifications-api.service';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AddNewNotifications, AddNotifications, GetNewNotifications, GetNotifications, NotificationsActionTypes, RemoveNotification, UpdateNotifications,
  UpdateNotificationsViewed } from './notifications.actions';
import { NotificationViewModel } from '../models/NotificationViewModel';
import { Unviewed, Viewed } from '../../../features/notifications/notification-constants';


@Injectable()
export class NotificationsEffects {


    @Effect()
    GetNotifications: Observable<any> = this.actions
    .pipe(
      ofType(NotificationsActionTypes.GET_NOTIFICATIONS),
      map((action: GetNotifications) => action.payload),
      switchMap(payload => {
        return this.notificationsApiService.getNotifications(payload)
          .pipe(
            map((notifications: NotificationViewModel[]) => {
                  return new AddNotifications(notifications);
            }))
            // .catch((error) => {
            //   console.log(error);
            //   return Observable.of(new LogInFailure({ error: error }));
            // });
    }));

    @Effect({ dispatch: false })
    AddNotifications: Observable<any> = this.actions
        .pipe(
            ofType(NotificationsActionTypes.ADD_NOTIFICATIONS)
        )

    @Effect()
    UpdateNotificationsViewed: Observable<any> = this.actions
          .pipe(
            ofType(NotificationsActionTypes.UPDATE_NOTIFICATIONS_VIEWED),
            map((action: UpdateNotificationsViewed) => {
              let notifications = action.payload.map(n => n);
              notifications.forEach(element => {
                if (element.status === Unviewed) {
                  element.status = Viewed;
                }
              });

              return new UpdateNotifications(notifications)
            })
    )

    @Effect()
    GetNewNotifications: Observable<any> = this.actions
            .pipe(
              ofType(NotificationsActionTypes.GET_NEW_NOTIFICATIONS),
              map((action: GetNewNotifications) => action.totalCount),
              switchMap(totalCount => {
                return this.notificationsApiService.getNewNotifications(totalCount)
                  .pipe(
                    map((newNotifications: NotificationViewModel[]) => {
                      return new AddNewNotifications(newNotifications);
                    }),
                    catchError((error) => {
                      console.log(error);
                      return of([]);
                    })
                  )
              })
            )

    @Effect()
    RemoveNotification: Observable<any> = this.actions.pipe(
      ofType(NotificationsActionTypes.REMOVE_NOTIFICATION),
      map((action: RemoveNotification) => action.notificationId),
      switchMap(notifId => {
        return this.notificationsApiService.deleteNotification(notifId)
          .pipe(
            map(() => {
              return new GetNotifications(0);
            })
          )
      })
    )

    constructor(
        private actions: Actions,
        private notificationsApiService: NotificationApiService
    ) {}

}
