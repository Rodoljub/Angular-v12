import { AfterViewInit, Directive, ElementRef, EventEmitter, HostListener, Output, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { OidcService } from '../../services/oidc.service';


@Directive({ selector: '[loginIframe]' })
export class LoginIframeDirective implements AfterViewInit {
    @Output() iFrameLoaded = new EventEmitter<boolean>();
    @Output() iFrameError = new EventEmitter();
    isInited = false;
    constructor(
        private elRef: ElementRef,
        private oidcService: OidcService,
        private renderer2: Renderer2,
        private router: Router
    ) { }

    @HostListener('load', ['$event'])
    onLoad(event) {
        console.log(event);

        // if (this.isInited) {

        // let height = this.elRef.nativeElement.contentWindow.document.body.scrollHeight;

        // this.renderer2.setStyle(this.elRef.nativeElement, 'height', height + 'px');

        // }
    }

    @HostListener('error', ['$event'])
    onError(event) {
        console.log(event);
        this.iFrameError.emit();
        // if (this.isInited) {

        // let height = this.elRef.nativeElement.contentWindow.document.body.scrollHeight;

        // this.renderer2.setStyle(this.elRef.nativeElement, 'height', height + 'px');

        // }
    }

    @HostListener('window:message', ['$event'])
    onLoadStart(event) {
        console.log(event);
        if (event.data && typeof event.data  === 'string') {
            if (event.data.startsWith('height')) {
                this.iFrameLoaded.emit(false);
                const height = +event.data.split('=')[1];
                if (height > 0) {
                    // this.renderer2.setStyle(this.elRef.nativeElement, 'height', height + 'px');
                    this.renderer2.setStyle(this.elRef.nativeElement, 'display', 'block');
                    // let iframeloginEl = document.querySelector('app-login-iframe');
                    // this.renderer2.setStyle(iframeloginEl, 'min-height', height + 'px')
                }
            }
            if (event.data.startsWith('close')) {
                let code = event.data.split('=')[1];
                    this.oidcService.getUser().then(user => {
                        if (!!user) {
                            this.oidcService.setLoginChanged();
                            setTimeout(() => {
                                this.router.navigate(['/'], { replaceUrl: true });
                            })
                            
                        }
                        this.router.navigate([{outlets: {auth: null}}]);
                    })
                    .catch(err => {
                        this.router.navigate([{outlets: {auth: null}}]);
                    })

            }

            if (event.data.startsWith('cancel')) {
                this.iFrameLoaded.emit(true);
            }

            if (event.data.startsWith('error')) {
                this.iFrameError.emit(true);
            }

            if (event.data.startsWith('forget')) {
                this.iFrameLoaded.emit(true);
                this.router.navigate([{outlets: {auth: 'accounts/forgotpassword'}}]);
            }

            if (event.data.startsWith('create')) {
                this.iFrameLoaded.emit(true);
                this.router.navigate([{outlets: {auth: 'accounts/register'}}]);
            }

            if (event.data.startsWith('Google')) {
                this.iFrameLoaded.emit(true);
                this.oidcService.loginExternal(event.data);
                this.router.navigate([{outlets: {auth: null}}]);
            }

            if (event.data.startsWith('Facebook')) {
                this.iFrameLoaded.emit(true);
                this.oidcService.loginExternal(event.data);
                this.router.navigate([{outlets: {auth: null}}]);
            }
        }
    }

    ngAfterViewInit() {
        this.isInited = true;
        // this.renderer2.setStyle(this.elRef.nativeElement, 'height', '310px');
        //         let iframeloginEl = document.querySelector('app-login-iframe');
        //         this.renderer2.setStyle(iframeloginEl, 'min-height', '310px')
    }
}
