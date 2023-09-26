import { Component, OnInit, ViewChild, OnDestroy,
  ChangeDetectorRef, AfterViewInit, HostListener,
  ViewEncapsulation, Inject, PLATFORM_ID, Renderer2, NgZone, AfterViewChecked } from '@angular/core';
import { FooterComponent } from './features/navigation/footer/footer.component';
import { Title, DomSanitizer } from '@angular/platform-browser';
import { EventService } from './services/utility/event.service';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Subscription } from 'rxjs';
import { isPlatformBrowser, isPlatformServer, DOCUMENT } from '@angular/common';
import { CommonResponseService } from './services/utility/common-response.service';
import { sidenavMenuAnimation, sidenavTranslateYAnimation } from './animation/animation';
import { config } from '../config/config';
import { ReportedContentService } from './services/rs/reported-content.service';
import { UtilityService } from './services/utility/utility.service';
import { ActivatedRoute, ActivationEnd, ActivationStart, ChildActivationEnd, NavigationEnd, NavigationStart, PRIMARY_OUTLET, RouteConfigLoadEnd, RouteConfigLoadStart, Router, RoutesRecognized, UrlSegment, UrlSegmentGroup, UrlTree } from '@angular/router';
import { AuthInterceptorService } from './features/accounts/services/auth-interceptor';
import { ItemViewModel } from './features/items/item/ItemViewModel';
import { UserProfileModel } from './features/accounts/models/UserProfileModel';
import { OidcService } from './features/accounts/services/oidc.service';
import { GuestService } from './features/guest/guest.service';
import { CoockiesNoticeService } from './features/common/legal-404/coockies-notice/coockies-notice.service';
import { Store } from '@ngrx/store';
import { AppState } from './store/app.state';
import { GetSavedSearches } from './store/actions/saved-searches.actions';
import { SwUpdate } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter } from 'rxjs/operators';
import { LocalStorageService } from './services/utility/local-storage.service';

declare var gtag

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [
    Title, EventService,
    CommonResponseService,
    UtilityService,
    AuthInterceptorService,
  ],
  animations: [
    sidenavMenuAnimation,
    sidenavTranslateYAnimation
  ]
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy  {
  mainSpinner = true;
  userAuthenticated: boolean = undefined;


  themeClass = 'quantum-theme';
  themeSubscription: Subscription;

  mainProgressSpinner = false;
  mainProgressSpinnerSubscription: Subscription;

  mainProgressSpinnerBacgroundClass = '';
  mainProgressBarType = config.progressBar.type.main;
  mainProgressBar = false;
  mainProgressBarSubscription: Subscription;

  // @ViewChild('headerToolbar') headerToolbar: HeaderComponent;
  @ViewChild('footerToolbar', {static: false}) footerToolbar: FooterComponent;
  headerHeight: number;
  footerHeight: number;

  resizeEventWidth: any;
  mobileView = false;

  appUpload = false;
  itemEditModeSubscription: Subscription;
  itemViewModel: ItemViewModel;

  sidenavTranslateYAnimationState: any;

  detectUserAgentPlatformRegX = new RegExp(config.detectUserAgentPlatformRegX);
  sidenavUploadAnimationState = 'uploadOut';
  touchDevice: boolean;

  coockiesNotice = false;
  guest = false;
  isBrowser = false;

  constructor(
    private store: Store<AppState>,
    private ngZone: NgZone,
    private eventService: EventService,
    public snackBar: MatSnackBar,
    private localStorageService: LocalStorageService,
    private overlayContainer: OverlayContainer,
    private changeDetectorRef: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object,
    private renderer2: Renderer2,
    private swUpdate: SwUpdate,
    private oidcService: OidcService,
    private reportedContentService: ReportedContentService,
    private utilityService: UtilityService,
    private router: Router,
    private coockiesNoticeService: CoockiesNoticeService,
    private route: ActivatedRoute
  ) {
    if (isPlatformBrowser(this.platformId)) { 
      this.isBrowser = true;
      const domain = this.utilityService.iconRegistry();
      this.overlayContainer.getContainerElement().classList.add(
        // domain +
        'quantum-theme'
        );

      this.oidcService.loginChanged.subscribe(userAuthenticated => {
          this.userAuthenticated = userAuthenticated;

      })

    }
  }


  @HostListener('window:resize', ['$event'])
  onResize() {
      this.setDeviceView();
  }


  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {

      this.ngZone.runOutsideAngular(() => {

      window.onbeforeunload = function () {
        this.mainProgressSpinner = false;
      }

      this.router.events.subscribe(event => {
        if(event instanceof NavigationEnd){
            gtag('config', 'G-9NGLBZ4CRM', 
                  {
                    'page_path': event.urlAfterRedirects
                  }
                 );
         }
      })

      this.router.events.subscribe((evt: ActivationStart) => {

        if (!(evt instanceof ActivationStart)) {
          return;
        }

        // console.log('app-component evt:' + evt)
        // console.log(evt)
        // console.log(this.route)
        const path = evt.snapshot.routeConfig.path;
        
        if (path === 'iframe-signin' || path === 'iframe-signin-callback') {

          // this.utilityService.setFixedScrollPosition(this.renderer2);
        } else {
          if (this.mainSpinner) {
            this.mainSpinner = false;
          }

          if (path === 'signin-callback' || path == 'external-signin-callback') {
            this.mainProgressSpinner = true;
            this.mainProgressSpinnerBacgroundClass = 'app-loading-wrapper';
          }

          // this.renderer2.setStyle(document.documentElement, 'overflow-y', 'scroll')
        }

      });


      // this.router.events.subscribe((evt: NavigationEnd) => {
      //   if (!(evt instanceof NavigationEnd)) {
      //     return;
      //   }
      //   const tree: UrlTree =
      //   this.router.parseUrl(evt.url)
      //   const g: UrlSegmentGroup = tree.root.children[PRIMARY_OUTLET];
      //   if (g && g.segments) {
      //     const s: UrlSegment[] = g.segments; 
      //     if (s.length > 0) {
      //       const seg = s.find(se => se.path && se.path === 'guest');
      //       if (!!seg && seg.path && seg.path === 'guest') {
      //         if (!this.guest)
      //           this.guest = true;
      //         } else {
      //           if (this.guest)
      //           this.guest = false;
      //         }
      //     }
      //   } else {
      //     if (this.guest)
      //           this.guest = false;
      //   }
        
        
      // })

      

      this.oidcService.isAuthenticated().then(userAuthenticated => {
        if (!this.mainSpinner) {
          this.userAuthenticated = userAuthenticated;

          const route = location.pathname;

          if (!this.userAuthenticated
             && route !== '/signin-callback'
             && route !== '/iframe-signin-callback'
             && route !== '/signout-callback'
             ) {
              const coockieNotice = this.localStorageService.get('coockieNotice');
              if (!coockieNotice) {
                this.coockiesNotice = true;
              } else {
                this.coockiesNotice = false;
              }
                this.changeDetectorRef.detectChanges();

          }
        }

      })



      if (this.swUpdate.isEnabled) {
          this.swUpdate.available.subscribe(() => {

            if(confirm("New version available. Load New Version?")) {

              window.location.reload();
          }
                // window.location.reload();
          });
      }



      this.scrollToTop();
      this.setDeviceView()

      this.getReportedContentReasons();

      //#region Main Progress Spinner
        this.mainProgressSpinnerSubscription = this.eventService.getMainProgressSpinner()
          .subscribe(progresSpinnerModel => {
            setTimeout(() => {
              // if (path !== 'iframe-signin' && path !== 'iframe-signin-callback') {
              this.mainProgressSpinner = progresSpinnerModel.progressStatus;

              if (progresSpinnerModel.isBackground) {
                this.mainProgressSpinnerBacgroundClass = 'app-loading-wrapper';
              } else {
                this.mainProgressSpinnerBacgroundClass = '';
              }

              this.changeDetectorRef.detectChanges();
            // }
            }, 200)
          })
      //#endregion Main Progress Spinner

      //#region Main Progress Bar
          this.mainProgressBarSubscription = this.eventService.getMainProgressBar()
            .subscribe(progressBar => {
                this.mainProgressBar = progressBar;

                if (progressBar === true) {
                  this.renderer2.addClass(document.body, 'noScroll')
                } else {
                  this.renderer2.removeClass(document.body, 'noScroll')
                }

                this.changeDetectorRef.detectChanges();
            })
      //#endregion Main Progress Bar

      //#region Item Edit Mode

      this.itemEditModeSubscription = this.eventService.getItemEditMode()
        .subscribe(item => {
          if (item === null) {
            this.closeEntry();
          } else if (item === undefined) {
            this.openUpload();
          } else {
            this.itemViewModel = item;
            this.openUpload();
          }
        })

      //#endregion Item Edit Mode

    })

      this.ngZone.runOutsideAngular(() => {});

      // #region Theming
      // this.themeSubscription = this.eventService.getTheme()
      //   .subscribe(theme => {

      //     this.overlayContainer.getContainerElement().classList.remove('quantum-theme')
      //     this.overlayContainer.getContainerElement().classList.remove('quantum-light-theme')
      //     this.overlayContainer.getContainerElement().classList.remove('quantum-dark-theme')
      //     if (theme === 'gray') {
      //       this.themeClass = 'quantum-theme'
      //       this.overlayContainer.getContainerElement().classList.add('quantum-theme')
      //     }
      //     if (theme === 'purple') {
      //       this.themeClass = 'quantum-light-theme'
      //       this.overlayContainer.getContainerElement().classList.add('quantum-light-theme')
      //     }
      //     if (theme === 'blue') {
      //       this.themeClass = 'quantum-dark-theme'
      //       this.overlayContainer.getContainerElement().classList.add('quantum-dark-theme')
      //     }
      //   })
      // #endregion Theming

    }
  }

  ngAfterViewInit() {

    // this.changeDetectorRef.detectChanges();

    // setTimeout(() => {
    //   this.headerHeight = this.headerToolbar.el.nativeElement.clientHeight;
    //   this.footerHeight = this.footerToolbar.el.nativeElement.clientHeight;
    // }, 100)
  }


  ngOnDestroy() {
    if (this.mainProgressSpinnerSubscription) {
      this.mainProgressSpinner = false;
      this.mainProgressSpinnerSubscription.unsubscribe();
    }
    if (this.mainProgressBarSubscription) {
      this.mainProgressBarSubscription.unsubscribe();
    }

    if (this.itemEditModeSubscription) {
      this.itemEditModeSubscription.unsubscribe();
    }
  }

  clickOnProgressSpiner(event) {
    event.stopImmediatePropagation();
  }

  getReportedContentReasons() {

    if (this.userAuthenticated) {

      let existReportedContentReasons = localStorage.getItem('reportedContentReasons');

      if (!existReportedContentReasons) {
        this.reportedContentService.getReportedContentReasons()
        .then(response => {
          localStorage.setItem('reportedContentReasons', JSON.stringify(response))

        })
        // .catch(error => this.errorResult)
      }
    }
  }

  onChangeHeaderHeight(event: number) {
    // this.sidenavTranslateYAnimationState = {value: event.toString(), params: {translate: 'translateY(' + event + 'px)'}}
    this.sidenavTranslateYAnimationState = {value: event.toString(), params: {translate: event + 'px'}}
    // document.documentElement.scrollTo(0, 0);
  }


  openUpload() {
    this.appUpload = true;
    this.utilityService.setFixedScrollPosition(this.renderer2);
    this.sidenavUploadAnimationState = 'in';
  }

  closeEntry() {
    this.sidenavUploadAnimationState = 'uploadOut';
    this.appUpload = false;
    this.utilityService.removeFixedScrollPosition(this.renderer2);
    this.itemViewModel = undefined;
  }


  private setDeviceView() {
    this.touchDevice = this.detectUserAgentPlatformRegX.test(navigator.appVersion);
    this.mobileView = this.detectUserAgentPlatformRegX.test(navigator.appVersion);
  }

  private scrollToTop() {
    document.scrollingElement.scroll(0, 0);
    window.scrollTo(0, 0);
  }

  onCoockieNotice() {
    this.localStorageService.setItem('coockieNotice', 1);
    this.coockiesNotice = false;
  }
}
