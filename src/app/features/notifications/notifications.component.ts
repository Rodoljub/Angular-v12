import { Component, Inject, Input, OnDestroy, OnInit, PLATFORM_ID, Renderer2, ViewChild } from '@angular/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { select, Store } from '@ngrx/store';
import { UtilityService } from '../../services/utility/utility.service';
import { AppState, selectNotificationsState, selectUploadState } from '../../store/app.state';
import { Observable, Subscription } from 'rxjs';
import { NotificationApiService } from '../../services/rs/notifications-api.service';
import { NotificationViewModel } from './models/NotificationViewModel';
import { Unviewed, ProjectFile, ProfileImage } from './notification-constants';
import { AddNewNotifications, GetNewNotifications, GetNotifications, UpdateNotificationsViewed } from './store/notifications.actions';
import { UploadStateModel } from '../upload/models/UploadStateModel';
import { RemoveAnalyzingImage } from '../upload/store/upload.actions';
import { GetProfile } from '../../store/actions/profile.actions';
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'app-notifications',
    templateUrl: 'notifications.component.html',
    styleUrls: ['notifications.component.scss']
})

export class NotificationsComponent implements OnInit, OnDestroy {
    getNotificationsStateSub: Subscription;
    getNotificationsState: Observable<NotificationViewModel[]>;
    notificationsResults: NotificationViewModel[] = [];

    getUploadStateSub: Subscription;
    getUploadState: Observable<UploadStateModel>;
    uploadState: UploadStateModel;

    notificationsActive = false;

    @ViewChild('notificationsMenuTrigger', {static: false}) notificationsMenuTrigger: MatMenuTrigger;
    @ViewChild('notificationsMenu', {static: false}) notificationsMenu: MatMenu;
    upNotifViewSub: Subscription;

    constructor(
        private store: Store<AppState>,
        private notificationsApiService: NotificationApiService,
        private utilityService: UtilityService,
        private renderer2: Renderer2,
        @Inject(PLATFORM_ID) private platformId: Object,
    ) {
        this.getNotificationsState = this.store.select(selectNotificationsState);
        this.getUploadState = this.store.select(selectUploadState);

    }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.getUploadStateSub = this.getUploadState.subscribe((uploadState) => {
                this.uploadState = uploadState;
            })

            this.getNotificationsStateSub = this.getNotificationsState.subscribe((notifications) => {
                this.notificationsResults = notifications;
                if (this.notificationsResults && this.notificationsResults.length > 0) {
                    this.isUnviewed();
                    this.isAnalyzedImages();
                    this.isProfileImageAnalyzed();
                }
            })



            // this.getNotificationsStateSub = this.store.pipe(select((state: any) => state.notifications)).subscribe((notifications) => {
            //     this.notificationsResults = notifications;

            //     if (this.notificationsResults.length > 0) {
            //         this.isUnviewed();
            //     }
            //  });
        }
    }
    isProfileImageAnalyzed() {
        if (this.notificationsResults.find(n => n.notificationType === ProfileImage
            && n.status === Unviewed
            )) {
                this.store.dispatch(new GetProfile())
            }
    }

    isAnalyzedImages() {
        if (this.uploadState && this.uploadState.analyzingImages
            && this.uploadState.analyzingImages.length > 0
            ) {
                let projectFileNotif = this.notificationsResults.map(v => v);
                projectFileNotif = projectFileNotif.filter(n => n.notificationType === ProjectFile);

                if (projectFileNotif.length > 0) {
                    projectFileNotif.forEach((notif, notifIndex) => {
                        let analyzingImage = this.uploadState.analyzingImages
                                .find(aI => aI.fileId === notif.value.SubjectImage);

                        if (analyzingImage) {
                            this.store.dispatch(new RemoveAnalyzingImage(analyzingImage));
                        }
                    })
                }
            }
    }

    isUnviewed() {
        const unviewed = this.notificationsResults.find(n => n.status === Unviewed);
        if (!unviewed) {
            this.notificationsActive = false;
        } else {
            this.notificationsActive = true;
        }
    }

    ngOnDestroy(): void {
        if (this.getNotificationsStateSub) {
            this.getNotificationsStateSub.unsubscribe();
        }

        if (this.getUploadStateSub) {
            this.getUploadStateSub.unsubscribe();
        }

        if (this.upNotifViewSub) {
            this.upNotifViewSub.unsubscribe();
        }
    }

    onMenuOpen() {
        if (this.notificationsActive) {
            this.notificationsActive = false;

            this.upNotifViewSub = this.notificationsApiService.updateNotificationsViewed()
                .subscribe(
                    resp => {
                        this.store.dispatch(new GetNotifications(0));
                        this.store.dispatch(new UpdateNotificationsViewed(this.notificationsResults));

                    }
                );

        } else {
            this.store.dispatch(new GetNotifications(0));

        }
    }

    onMenuClose() {}


    onNewNotifications(event) {
        let totalCount = 0;

        if (this.notificationsResults.length > 0) {
            totalCount = this.notificationsResults[0].totalCount;
        }
        this.store.dispatch(new GetNewNotifications(totalCount))
    }
}
