import { Component, OnInit, Input, ViewEncapsulation, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ProfileDetailsService } from './profile-details.service';
import { ProfileDetailsModel } from './ProfileDetailsModel';
import { ProfileService } from '../accounts/services/profile.service';
import { ImagesService } from '../../services/rs/images.service';
import { AppState, selectProfileState } from '../../store/app.state';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';


@Component({
    selector: 'app-profile-details',
    templateUrl: 'profile-details.component.html',
    styleUrls: ['profile-details.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ProfileDetailsComponent implements OnInit, OnDestroy {

    getProfileState: Observable<ProfileDetailsModel>;
    getProfileStateSub: Subscription;


    @Input() urlSegment: string;

    @Input() userName;
    profileDetails: ProfileDetailsModel;
    userImagePath;
    profileImageLoading = true;
    load = true;
    constructor(
        private store: Store<AppState>,
        @Inject(PLATFORM_ID) private platformId: Object,
        private profileDetailsService: ProfileDetailsService,
        private profileService: ProfileService,
        private immageService: ImagesService
    ) {
        this.getProfileState = this.store.select(selectProfileState);
    }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.setInit();

        }
    }

    ngOnDestroy(): void {
        if (this.getProfileStateSub) {
            this.getProfileStateSub.unsubscribe();
        }
    }

    setInit() {
        if (this.urlSegment) {
            this.getDetailsBySegment()
        } else {
            this.getProfileStateSub = this.getProfileState.subscribe((profile) => {
                this.profileDetails = profile;
                if (this.profileDetails.imagePath === null) {
                    this.userImagePath = this.immageService.getDefaultProfileImage();
                 } else {
                    this.userImagePath = this.profileDetails.imagePath;
                }
                this.load = false;
            })
        }
    }

    getDetailsByEmail(email: string) {
        this.profileDetailsService.getDetailsByEmail(email)
        .subscribe(
            resp => {
                this.profileDetails = resp;
                 if (this.profileDetails.imagePath === null) {
                    this.userImagePath = this.immageService.getDefaultProfileImage();
                 } else {
                    this.userImagePath = this.profileDetails.imagePath;
                }
                this.load = false;
            },
            error => {}
        );
    }

    getDetailsBySegment() {
        
        this.profileDetailsService.getDetailsBySegment(this.urlSegment)
            .subscribe(
                resp => {
                    this.profileDetails = resp;
                    if (this.profileDetails.imagePath === null) {
                        this.userImagePath = this.immageService.getDefaultProfileImage();
                     } else {
                         this.userImagePath = this.profileDetails.imagePath;
                     }
                    this.load = false;
                },
                error => {}
            )
    }
}
