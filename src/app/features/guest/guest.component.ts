import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, Inject,
     OnDestroy,
     OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { OidcService } from '../accounts/services/oidc.service';
import { GuestService } from './guest.service';
// import { GuestState } from './guest.state';

@Component({
    selector: 'app-guest',
    templateUrl: 'guest.component.html',
    styleUrls: ['guest.component.scss'],
    // providers: [ GuestState ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class GuestComponent implements OnInit, OnDestroy {
    load = false;
    wideLayout = false;
    isInterestsFocused = false;

    mobileWrapTopClass = '';

    hobbyisImagePath = '/assets/images/hobbyists.png';
    focusInterestSub: Subscription;
    loginChangedSub: Subscription;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private guestService: GuestService,
        private oidcService: OidcService,
        private router: Router

    ) {
        this.focusInterestSub = this.guestService.focusInterestChanged.subscribe(focus => {
            this.isInterestsFocused = focus;

            if (focus) {
                this.mobileWrapTopClass = 'gmw-top';
            } else {
                this.mobileWrapTopClass = '';
            }
        })

        this.loginChangedSub = this.oidcService.loginChanged.subscribe(userAuthenticated => {
            if (userAuthenticated) {
                this.router.navigate(['/'], { replaceUrl: true });
            };
  
        })
     }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        const resizeEventWidth = event.target.innerWidth;
        this.resize(resizeEventWidth)
    }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.guestService.removeInterests();
            const resizeEventWidth = document.scrollingElement.clientWidth;
            this.resize(resizeEventWidth);
            this.load = true;
        }
     }

     ngOnDestroy() {
        if(this.loginChangedSub) {this.loginChangedSub.unsubscribe()}

        if(this.focusInterestSub) {this.focusInterestSub.unsubscribe()}
     }

    resize(clientWidth: number) {
        if (clientWidth < 680) {
            this.wideLayout = false;
        } else {
            this.wideLayout = true;
        }

    }

}
