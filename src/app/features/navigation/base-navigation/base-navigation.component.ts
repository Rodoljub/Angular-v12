import { Component, HostListener, EventEmitter, Output } from '@angular/core';
import { UserProfileModel } from '../../accounts/models/UserProfileModel';
import { Subscription } from 'rxjs';
import { config } from '../../../../config/config';
import { UtilityService } from '../../../services/utility/utility.service';

@Component({
  selector: 'app-base-navigation',
  templateUrl: './base-navigation.component.html'
})
export class BaseNavigationComponent {
  defaultProfilPic: string = config.defaultProfilePicture;



  searchResponsive = true;

  mobileView = true;
  touchDevice = false;

  detectUserAgentPlatformRegX = new RegExp(config.detectUserAgentPlatformRegX);

  @Output() closeMenuOutput = new EventEmitter();

  searchInputIsOpen = false;
  headerSearchCloseClass = 'header-search-wrap-close';

  changeViewLoading = false;

  // #region Client View
    currentView: string;
    smallView = config.clientWidthTypes.small;
    middelView = config.clientWidthTypes.middel;
    wideView = config.clientWidthTypes.wide;
  //#endregion Client View

  constructor(
    private utilityService: UtilityService
  ) { }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    const resizeEventWidth = event.target.innerWidth;
    this.gridTileResize(resizeEventWidth);
  }

  gridTileResize(resizeEventWidth) {
    this.touchDevice = this.detectUserAgentPlatformRegX.test(navigator.userAgent);
    this.currentView = this.utilityService.setClientWidthType(resizeEventWidth);
    // #region Search Box Responsive
    if (resizeEventWidth < 1025) {
      this.searchResponsive = true;
    }
    if (resizeEventWidth >= 1025) {
      this.searchResponsive = false;
    }
    // #endregion Search Box Responsive

    if (resizeEventWidth < 480) {
      this.mobileView = true;
    } else {
      this.mobileView = false;
    }
  }
}
