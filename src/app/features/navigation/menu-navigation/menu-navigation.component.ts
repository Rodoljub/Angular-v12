import { Component, OnInit, Input, OnDestroy, PLATFORM_ID, Inject, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { isPlatformBrowser, isPlatformServer, DOCUMENT, Location } from '@angular/common';
import { BaseNavigationComponent } from '../base-navigation/base-navigation.component';
import { EventService } from '../../../services/utility/event.service';
import { AccountsEventsService } from '../../accounts/accounts-events.service';
import { config } from '../../../../config/config';
import { UtilityService } from '../../../services/utility/utility.service';
import { UserProfileModel } from '../../accounts/models/UserProfileModel';
import { OidcService } from '../../accounts/services/oidc.service';
import { UserService } from '../../accounts/services/user.service';

@Component({
  selector: '[app-menu-navigation]',
  templateUrl: './menu-navigation.component.html',
  styleUrls: ['./menu-navigation.component.css'],

})
export class MenuNavigationComponent extends BaseNavigationComponent implements OnInit, OnDestroy {

  @Input() userAuthenticated: boolean;
  profileButtonColor = '';
  portfolioButtonColor = '';
  favouritesButtonColor = '';
  saveSearchButtonColor = '';

  uploadLabel = config.labels.navigationMenu.upload;
  portfolioLabel = config.labels.navigationMenu.portfolio;
  favouritesLabel = config.labels.navigationMenu.favourites;
  logoutLabel = config.labels.navigationMenu.logout;
  saveSearchLabel = config.labels.navigationMenu.savedSearch;
  profileLabel = config.labels.navigationMenu.profile;

  @Input() isMobileView: boolean;


  constructor(
    location: Location,
    userService: UserService,
    private router: Router,
    accountsEventsService: AccountsEventsService,
    private oidcService: OidcService,
    private eventService: EventService,
    route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object,
    renderer2: Renderer2,
    utilityService: UtilityService
  ) {
    super(utilityService)

  }

  ngOnInit() {

    if (isPlatformBrowser(this.platformId)) {
      // Client only code.
      let snap =  this.router.url.split('?')[0]
      this.swichButtonActive(snap)
      this.router.events.subscribe((event: NavigationEnd) => {
      snap =  this.router.url.split('?')[0]
      this.swichButtonActive(snap)
    })
   }
   if (isPlatformServer(this.platformId)) {
     // Server only code.

   }

  }

  swichButtonActive(snap) {
    switch (snap) {
      case '':
      this.buttonDeactivate();
      break;

      case '/(auth:accounts/profile)':
      this.buttonDeactivate();
      this.profileButtonColor = 'accent';
      break;

      case '/portfolio':
      this.buttonDeactivate();
      this.portfolioButtonColor = 'accent';
      break;

      case '/favourites':
      this.buttonDeactivate();
      this.favouritesButtonColor = 'accent';
      break;

      case '/savedSearches':
      this.buttonDeactivate();
      this.saveSearchButtonColor = 'accent';
      break;

      default:
      this.buttonDeactivate();
      break;
    }
  }

  ngOnDestroy() {
    // this.activateButtonSubscription. unsubscribe();
  }

  buttonDeactivate() {
    this.profileButtonColor = '';
    this.portfolioButtonColor = '';
    this.favouritesButtonColor = '';
    this.saveSearchButtonColor = '';
  }

  navigateToProfile() {
    this.router.navigate([{outlets: {auth: 'accounts/profile'}}]);
  }

  logout() {
    // this.eventService.setLoginUser(null);
    this.oidcService.logout();
  }

  headerNavigateToUpload() {
    setTimeout(() => {
        if (this.userAuthenticated) {
          this.eventService.setItemEditMode(undefined);
        } else {
          this.router.navigate([{ outlets: { auth: 'accounts/login'} }]);
        }


    }, 0)
    // this.router.navigate([{outlets: {upload: 'upload'}}]);
  }

  closeMenu() {

    const resizeEventWidth = document.scrollingElement.clientWidth;
    this.gridTileResize(resizeEventWidth)
    if (this.mobileView) {
      this.closeMenuOutput.emit();
    }
  }
}
