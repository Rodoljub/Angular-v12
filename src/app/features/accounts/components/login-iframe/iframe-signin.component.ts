import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { OidcService } from '../../services/oidc.service';

@Component({
    selector: 'app-iframe-signin',
    template: `<div></div>`
})

export class IFrameSigninComponent implements OnInit {
    constructor(
        private oidcService: OidcService
    ) { }

    ngOnInit() {
        this.oidcService.loginIframe()
            .catch(err => {
                window.top.postMessage('error', environment.appDomain);
            });
    }
}
