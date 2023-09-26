import {
  Component, OnInit, OnDestroy,
  ViewChild, PLATFORM_ID, Inject, Renderer2, ViewEncapsulation, HostListener, ElementRef, AfterViewInit
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, NavigationEnd, ActivationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { accountsCardOpacityAnimation } from '../../animation/animation';
import { BaseAccountsComponent } from './components/base-accounts/base-accounts.component';
import { AccountsEventsService } from './accounts-events.service';
import { isPlatformBrowser } from '../../../../node_modules/@angular/common';
import { UtilityService } from '../../services/utility/utility.service';
import { config } from '../../../config/config';
import { Location } from '@angular/common'

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['accounts.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    accountsCardOpacityAnimation
  ]
})
export class AccountsComponent extends BaseAccountsComponent implements OnInit, AfterViewInit, OnDestroy {
  private history: string[] = []

  accountsCardOpacityAnimationState = 'out';

  accContentOpacityClass = '';

  accountCardTitle = '';
  accountCardTitleSubscription: Subscription;

  accountProgressSpinner = true;

  accountProgressBarType = config.progressBar.type.accounts;
  accountProgressBar = false;
  accountProgressBarSubscription: Subscription;

  animationSubscription: Subscription;
  _accountsEventsService: AccountsEventsService;
  _router: Router;
  _route: ActivatedRoute;
  _titleService: Title;

  load = true;

  loginPath = false;

  cardHeight: number;
  @ViewChild('accCard', {static: false}) accCard: ElementRef;
  @ViewChild('matCardContent', {static: false}) matCardContent: ElementRef;
  cardHeader = false;
  mobileContentClass = '';
  routerEventsSubscription: Subscription;

  initialTitle

  constructor(
    route: ActivatedRoute,
    router: Router,
    accountsEventsService: AccountsEventsService,
    titleService: Title,
    @Inject(PLATFORM_ID) private platformId: Object,
    private renderer2: Renderer2,
    private utilityService: UtilityService,
    private location: Location
  ) {
    super(
      accountsEventsService,
      titleService,
      route,
      router
    )
    this._accountsEventsService = accountsEventsService;
    this._router = router;
    this._route = route;
    this._titleService = titleService;

    // this.accountProgressSpinner = true;
  }

  @HostListener('window:resize')
  onWindowResize() {
    this.setCardLayout();
    this.resizeSpinnerCardLayout()
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initialTitle = this._titleService.getTitle();
      this.setCardLayout();
      this.utilityService.setFixedScrollPosition(this.renderer2);

      this.animationSubscription = this._accountsEventsService.getAnimation().subscribe(state => {
        switch (state) {
          case 'in':
            this.acoountAnimationIn();
            break;

          case 'out':
            this.acoountAnimationOut();
            break;
        }
      })

      this.accountCardTitleSubscription = this._accountsEventsService.getAccountsCardTitle()
        .subscribe(title => {
          setTimeout(() => {this.accountCardTitle = title})
        });

      this.accountProgressBarSubscription = this._accountsEventsService.getAccountProgressBar()
        .subscribe(progressBar => {
            this.accountProgressBar = progressBar;
        })

      this.routerEvents()
      this.load = false;
    }
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    if (this.animationSubscription) {
      this.animationSubscription.unsubscribe();
    }
    if (this.accountCardTitleSubscription) {
      this.accountCardTitleSubscription.unsubscribe();
    }
    if (this.accountProgressBarSubscription) {
      this.accountProgressBarSubscription.unsubscribe();
    }

    if (isPlatformBrowser(this.platformId)) {
      this.routerEventsSubscription.unsubscribe();
      this.utilityService.removeFixedScrollPosition(this.renderer2);
      this._titleService.setTitle(this.initialTitle);
    }
  }

  routerEvents() {
      this.routerEventsSubscription = this._router.events.subscribe((evt: ActivationEnd) => {
        if (evt instanceof NavigationEnd) {
          this.history.push(evt.urlAfterRedirects)
        }

        if (!(evt instanceof ActivationEnd)) {
          return;
        }

        const path = evt.snapshot.routeConfig.path;
        if (path === 'iframe-signin' || path === 'iframe-signin-callback') {

        } else {
          this.accountProgressSpinner = false
        }
        this.accCard.nativeElement.scrollTop = 0;
        this.matCardContent.nativeElement.scrollTop = 0;

    });

  }

  setCardLayout() {
    let clientWidth = document.body.clientWidth;
    if (clientWidth > 620) {
      this.cardHeader = false;
      this.mobileContentClass = '';
    } else {
      this.cardHeader = true;
      this.mobileContentClass = 'acc-mob-content'
    }
  }



  private setSpinnerCardLayout() {
    if (this.accCard && this.matCardContent) {
      const accCardEl: HTMLElement = this.accCard.nativeElement;
      const matCardCont: HTMLElement = this.matCardContent.nativeElement;
      const accCardHeight = accCardEl.clientHeight;
      if (document.scrollingElement.clientWidth < 620) {
        this.renderer2.setStyle(matCardCont, 'display', 'none');
      } else {
        this.renderer2.setStyle(accCardEl, 'min-height', accCardHeight + 'px');
        this.renderer2.setStyle(matCardCont, 'display', 'none');
      }
    }
  }

  resizeSpinnerCardLayout() {
    if (this.accountProgressSpinner) {
      if (document.scrollingElement.clientWidth >= 620) {
        if (this.accCard) {
          this.renderer2.setStyle(this.accCard.nativeElement, 'min-height', '80vh');
        }
      }
    }
  }

  acoountAnimationIn() {
    setTimeout(() => {
      this.accountsCardOpacityAnimationState = 'in';

      this.accContentOpacityClass = '';
  
      this.accountProgressSpinner = false;
  
      this.removeSpinnerCardLayout();
    })
  }

  acoountAnimationOut() {
    setTimeout(() => {
      this.accountsCardOpacityAnimationState = 'out';

      this.accContentOpacityClass = 'acc-content-opacity'

      this.accountProgressSpinner = true;

      this.setSpinnerCardLayout();
    })
  }

  private removeSpinnerCardLayout() {
    if (this.accCard && this.matCardContent) {
      const accCardEl: HTMLElement = this.accCard.nativeElement;
      const matCardCont: HTMLElement = this.matCardContent.nativeElement;
      if (document.scrollingElement.clientWidth < 620) {
        this.renderer2.removeStyle(matCardCont, 'display');
      } else {
        this.renderer2.removeStyle(accCardEl, 'min-height');
        this.renderer2.removeStyle(matCardCont, 'display');
      }
    }
  }

  clickCloseAccounts() {
    this._router.navigate([{outlets: {auth: null}}]);
  }

  locationBack() {
    this.history.pop()
    if (this.history.length > 0) {
      this.location.back()
    } else {
      this._router.navigateByUrl('/')
    }
  }
}
