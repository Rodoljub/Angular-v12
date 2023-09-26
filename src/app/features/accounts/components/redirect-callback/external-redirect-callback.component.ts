import { Component, OnInit } from '@angular/core';
import { OidcService } from '../../services/oidc.service';

@Component({
    selector: 'app-external-redirect-callback',
    template: `<div></div>`
})

export class ExternalRedirectCallbackComponent implements OnInit {
    constructor(
        private _oidcService: OidcService
    ) { }

    ngOnInit() {
        this._oidcService.loginOIDC()

     }
}