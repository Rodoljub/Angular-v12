import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Input, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { OidcService } from '../../../../features/accounts/services/oidc.service';
import { config } from '../../../../../config/config';

@Component({
    selector: 'app-social-nav-label',
    templateUrl: 'social-nav-label.component.html',
    styleUrls: ['social-nav-label.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class SocialNavLabelComponent implements OnInit {
    @Input() socialProvider: string;

    socialButtonClass = '';
    socialIcon = '';

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private oidcService: OidcService
    ) { }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.setLabel();
        }
    }

    setLabel() {
        switch (this.socialProvider) {
            case config.labels.navigation.facebook:
                this.socialButtonClass = 'fb-button';
                this.socialIcon = 'fb';
                break;
            case config.labels.navigation.google:
                this.socialIcon = 'google';
                break;

            default:
                break;
        }
    }

    socialSignUp() {
        switch (this.socialProvider) {
            case config.labels.navigation.facebook:
                this.oidcService.loginExternal(this.socialProvider);
                break;
            case config.labels.navigation.google:
                this.oidcService.loginExternal(this.socialProvider);
                break;

            default:
                break;
        }
    }
}
