import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificationViewModel } from '../../features/notifications/models/NotificationViewModel';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { catchError, map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class NotificationApiService {
    notificationApiUrl = `${environment.rsURi}/api/notifications`;
    constructor(
        private httpClient: HttpClient
    ) { }

    getNotifications(skip: number): Observable<NotificationViewModel[]>  {
        const url = `${this.notificationApiUrl}?skip=${skip}`

        return this.httpClient.get<NotificationViewModel[]>(url)
    }

    getNewNotifications(totalCount: number): Observable<NotificationViewModel[]> {
        const url = `${this.notificationApiUrl}/new?totalCount=${totalCount}`;

        return this.httpClient.get<NotificationViewModel[]>(url)
                .pipe(
                    map(v => v),
                    catchError(err => of([])));

    }

    updateNotificationsViewed(): Observable<any> {
        const url = `${this.notificationApiUrl}/update`;

        return this.httpClient.get<any>(url)
            .pipe();
    }

    deleteNotification(id: string): Observable<any> {
        const url = `${this.notificationApiUrl}/delete`;

        let input = new FormData();
        input.append('id', id);
        return this.httpClient.post(url, input)
        .pipe();
    }
}
