import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { config } from '../../../../../config/config';
import { environment } from '../../../../../environments/environment';
import { OidcService } from '../../services/oidc.service';

@Component({
  selector: 'app-iframe-redirect-callback',
  template: `<div></div>`
})
export class IFrameSigninRedirectCallbackComponent implements OnInit {
  constructor(private _oidcService: OidcService, private _router: Router
  ) { }
  ngOnInit(): void {
        this._oidcService.finishLogin()
    .then(resp => {
      console.log(resp)
      let code = this._router.url.split('?')[1];
      window.top.postMessage('close' + '?' + code, environment.appDomain);      
    })
    .catch(_ => {
      // this._router.navigate([config.iframeSigninPath], { replaceUrl: true });

      let code = this._router.url.split('?')[1];
      window.top.postMessage('close' + '?' + code, environment.appDomain);
      this._router.navigate(['/'], { replaceUrl: true });
    })
  }
}
