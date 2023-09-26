import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { NotificationViewModel } from '../models/NotificationViewModel';
import { ProfileImage, ProjectFile } from '../notification-constants';
import { RemoveNotification } from '../store/notifications.actions';

@Component({
    selector: 'app-notification',
    templateUrl: 'notification.component.html',
    styleUrls: ['notification.component.scss']
})

export class NotificationComponent implements OnInit {
    @Input() notification: NotificationViewModel;
    @Input() index;

    notificationMessage
    notificationDate


    userImage
    constructor(
        private router: Router,
        private store: Store<AppState>,
    ) { }

    ngOnInit() {
        this.userImage = this.notification.value.SubjectImage;
        this.notificationMessage = this.notification.value.Message;
        this.notificationDate = this.notification.createdDate;
    }

    clickOnNotification() {

        switch (this.notification.notificationType) {
            case ProjectFile:
                this.router.navigate([{outlets: {a: [ 'aa', this.notification.value.Url ]}}]);
                break;

            case ProfileImage:
                this.router.navigate([{outlets: {auth: [ 'accounts', this.notification.value.Url ]}}]);
                break;

            default:
                break;
        }
    }

    deleteNotification(event) {
        this.store.dispatch(new RemoveNotification(this.notification.id))
        event.stopImmediatePropagation();
    }
}

