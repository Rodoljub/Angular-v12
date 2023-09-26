import { Component, Input, OnInit } from '@angular/core';
import { NotificationViewModel } from '../models/NotificationViewModel';

@Component({
    selector: 'app-notification-list',
    templateUrl: 'notification-list.component.html',
    styleUrls: ['notification-list.component.scss']
})

export class NotificationListComponent implements OnInit {
    @Input() notifications: NotificationViewModel[] = [];
    constructor() { }

    ngOnInit() { }

    trackByItems(index, notification: NotificationViewModel) {
        return notification; // or item.id
    }
}
