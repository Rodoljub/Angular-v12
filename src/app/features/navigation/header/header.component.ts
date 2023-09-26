import {
  Component, OnInit, OnDestroy,
  Inject, PLATFORM_ID, Renderer2, ViewEncapsulation, HostListener, ChangeDetectionStrategy, Input } from '@angular/core';
import { Router, ActivatedRoute, ActivationEnd } from '@angular/router';
import { EventService } from '../../../services/utility/event.service';
import { SafeUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { BaseNavigationComponent } from '../base-navigation/base-navigation.component';
import { isPlatformBrowser, Location, isPlatformServer } from '@angular/common';
import { UtilityService } from '../../../services/utility/utility.service';
import { headerDivHeightAnimation } from '../../../animation/animation';
import { config } from '../../../../config/config';
import { snackBarConfig } from '../../../../config/snackBarConfig';
import { AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.state';
import { SetMainSpinner } from '../../../store/actions/main-spinner.actions';


@Component({
  selector: 'app-header',
  templateUrl: './header-material.component.html',
  styleUrls: ['header.component.scss'],
  encapsulation: ViewEncapsulation.None,
  // changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    UtilityService
  ],
  animations: [
    headerDivHeightAnimation
  ]

})
export class HeaderComponent extends BaseNavigationComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() userAuthenticated: boolean;
  isModalMenu = false;

  desktopHeaderLoad = false;

  userImage: string;
  userImageSafe: SafeUrl;
  headerDivHeightAnimationState = 'in';
  _eventService: EventService;
  _router: Router;


  backLabel = config.labels.navigationMenu.back;

  headerTranslateEnable = false;

  viewSectionSubscription: Subscription;
  isViewSection = false;

  viewLabelClass = 'open-saved-search-disabled';

  isBrowserPlatform = false;

  constructor(
    private store: Store<AppState>,
    router: Router,
    eventService: EventService,
    @Inject(PLATFORM_ID) private platformId: Object,
    utilityService: UtilityService
  ) {

    super(
      utilityService
    )

    this._eventService = eventService;

    this._router = router;
  }



  // #region Ng LifeCicles

    ngOnInit() {
      if (isPlatformBrowser(this.platformId)) {
        setTimeout(() => {

        
        this.isBrowserPlatform = true;
        const resizeEventWidth = document.scrollingElement.clientWidth;
        this.gridTileResize(resizeEventWidth);

        this.viewSectionSubscription = this._eventService.getViewSection()
        .subscribe(data => {
          this.isViewSection = data

          if (this.isViewSection) {
            this.viewLabelClass = '';
        } else {
            this.viewLabelClass = 'open-saved-search-disabled';
        }
        });


        this.desktopHeaderLoad = true;
        this.store.dispatch(new SetMainSpinner(false));

      })

      }

      if (isPlatformServer(this.platformId)) {
        this.mobileView = true;
      }
    }

    ngAfterViewInit() {

    }

    onChangeSearchInputState(event) {
      this.searchInputIsOpen = event;
        if (event) {
          this.headerSearchCloseClass = '';
        } else {
          this.headerSearchCloseClass = 'header-search-wrap-close';
        }
    }

    headerNavigateToHome() {
      this._router.navigate(['/']);
    }

    ngOnDestroy() {

      if (this.viewSectionSubscription) {
        this.viewSectionSubscription.unsubscribe();
      }
    }

  // #endregion Ng LifeCicles

}



