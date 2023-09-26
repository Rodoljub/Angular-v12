import { Component, OnInit, ViewChild, Output, EventEmitter, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { ReCaptchaComponent } from 'angular2-recaptcha';
import { environment } from '../../../../environments/environment';
import { Subscription } from 'rxjs';
import { EventService } from '../../../services/utility/event.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-recaptcha',
  templateUrl: './recaptcha.component.html',
  styles: []
})
export class RecaptchaComponent implements OnInit, OnDestroy {
  reCaptcha = false;
  reCaptchaSubscription: Subscription;
  reCaptchaActionSubscription: Subscription
  gRecaptchaResponse: string;
  siteKey: string = environment.siteKey
  // @Output() onGRecaptchaResponse = new EventEmitter<string>();

  @ViewChild(ReCaptchaComponent, {static: false}) captcha: ReCaptchaComponent;


  constructor(
    private eventService: EventService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
    this.reCaptchaSubscription = this.eventService.getReCaptchaState()
      .subscribe(data => {
        this.reCaptcha = data;
      });
    this.reCaptchaActionSubscription = this.eventService.getReCaptchaAction()
      .subscribe(data => {
        switch (data) {
          case 'execute':
          this.executeRecaptcha(null);
          break;

          case 'reset':
          this.resetRecaptcha(null);
          break;

          default:

        }

        // if (data = 'execute') {
        //   this.executeRecaptcha(null);
        // }


      })
    }
  }

  ngOnDestroy() {
    if (this.reCaptchaActionSubscription) {
      this.reCaptchaActionSubscription.unsubscribe();
    }
  }

  handleCorrectCaptcha(response: any) {
    this.gRecaptchaResponse = this.captcha.getResponse().toString();
    this.eventService.setgRecaptchaResponse(this.gRecaptchaResponse);
  }

  resetRecaptcha(data: any) {
    this.captcha.reset();
  }

  executeRecaptcha(data: any) {
    if (this) {
      this.captcha.execute();

    }
  }

}
