import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { config } from '../../../../../config/config';
import { environment } from '../../../../../environments/environment';
import { AccountsEventsService } from '../../accounts-events.service';
import { BaseAccountsComponent } from '../base-accounts/base-accounts.component';

@Component({
    selector: 'app-login-iframe',
    templateUrl: 'login-iframe.component.html',
    styleUrls: ['login-iframe.component.scss']
})

export class LoginIFrameComponent extends BaseAccountsComponent implements OnInit, OnDestroy {
    @ViewChild('iframeEl', {static: false}) iframeEl: ElementRef;
    loginPath = environment.rsURi + config.connectAuthPath;
    iframeSigninPath = environment.appDomain + config.iframeSigninPath;
    iFrameSrc;

    constructor(
        route: ActivatedRoute,
        titleService: Title,
        router: Router,
        private sanitizer: DomSanitizer,
        accountsEventsService: AccountsEventsService,
        private renderer2: Renderer2
    ) {
        super(
            accountsEventsService,
            titleService,
            route,
            router
        )
    }

    ngOnInit() {
        super.accountSetTitle('Login')
        let accCard = document.getElementById('acc-card');
        if (accCard) {
            this.renderer2.setStyle(accCard, 'overflow', 'hidden');
            // this.renderer2.setStyle(this.accCard.nativeElement, 'padding', '0');
            this.renderer2.setStyle(accCard, 'border', '0');
            this.renderer2.setStyle(accCard, 'min-height', '310px');
          }

        this.iFrameSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.iframeSigninPath);

    }

    ngOnDestroy(): void {
        let accCard = document.getElementById('acc-card');
        if (accCard) {
            this.renderer2.removeStyle(accCard, 'overflow');
            // this.renderer2.removeStyle(this.accCard.nativeElement, 'padding');
            this.renderer2.removeStyle(accCard, 'border');
            this.renderer2.removeStyle(accCard, 'min-height');
          }
    }

    onIFrameLoaded(event) {
        if (event) {
            super.acoountAnimationOut();
        } else {
            super.acoountAnimationIn();
        }
    }

    oniFrameError() {
        super.acoountAnimationIn();
    }
}
