import { Injectable, Inject, Renderer2, PLATFORM_ID } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { EventService } from './event.service';
import { config } from '../../../config/config';
import { snackBarConfig } from '../../../config/snackBarConfig';
import { isPlatformServer, Location } from '@angular/common';
import { SnackBarService } from '../../features/common/snack-bar/snack-bar.service';
import { SnackBarModel } from '../../features/common/snack-bar/snack-bar-model';
import { MetaTagsModel } from '../../shared/MetaTagsModel';
import { ItemViewModel } from '../../features/items/item/ItemViewModel';
import { environment } from '../../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { TooltipPosition } from '@angular/material/tooltip';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  detectUserAgentPlatformRegX = new RegExp(config.detectUserAgentPlatformRegX);
  _snackBarService: SnackBarService;
  _iconRegistry: MatIconRegistry;
  _sanitizer: DomSanitizer;

  constructor(
    private router: Router,
    private eventService: EventService,
    @Inject(SnackBarService) snackBarService: SnackBarService,
    private location: Location,
    iconRegistry: MatIconRegistry, sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private platformId: Object,

    // private renderer2: Renderer2
  ) {
    this._snackBarService = snackBarService;
    this._iconRegistry = iconRegistry;
    this._sanitizer = sanitizer;
  }

  mapJsonStringToObject<T>(jsonString: string, object?: T): T {

    let temp: T = object || {} as T;

    JSON.parse(jsonString, (key, value) => {

      let prop = this.capitalize(key);

      try {
        temp[prop] = value;
      } catch (e) {

        console.log(`Property "${prop}" does not exist in "${typeof (temp)}"`);
      }
    })
    return temp;
  }

  mapJsonObjectToObject<T>(jsonObject: any,  object?: T): T {

    let temp: T = object || {} as T;

    if (jsonObject) {
      let jsonObjectPropertyNames = Object.getOwnPropertyNames(jsonObject);

      jsonObjectPropertyNames.forEach((propName, propNameIndex) => {

        let value = jsonObject[propName];


        let prop = this.capitalize(propName);

        try {
          temp[prop] = value;
        } catch (e) {

          console.log(`Property "${prop}" does not exist in "${typeof (temp)}"`);
        }
      })
    }

    return temp;
  }

  capitalize(input: string): string {
    return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1) : '';
  }

  urlEncode(obj: Object): string {
    let urlSearchParams = new URLSearchParams();
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
      urlSearchParams.append(key, obj[key] || '' );
      }
    }
    return urlSearchParams.toString();
  }

  redirectToLogin(itemId?, returnUrl?) {
    // this.eventService.setLoginUser(null);
    let navigationExtras: NavigationExtras = {}
    if (itemId !== '') {

      navigationExtras = {
        // queryParams: { 'returnUrl': path, 'returnItemUrl': itemId }
      };
    }

    if (returnUrl) {
      navigationExtras = {
        queryParams: { 'returnUrl': returnUrl}
      };
    };

    this.router.navigate([ {outlets: {auth: 'accounts/login'}}], navigationExtras)


    let locationPath = this.location.path();
    this.location.go(locationPath)
    let infoMessage = 'Please Login';
    this._snackBarService.popMessageInfo(infoMessage);

  }

  setTooltipClass(tooltipPosition: TooltipPosition) {
    let toolClass = '';
    switch (tooltipPosition) {
      case 'above':
        toolClass = 'tooltip-arrow-below'
      break;
      case 'after':
        toolClass = 'tooltip-arrow-before'
      break;
      case 'before':
        toolClass = 'tooltip-arrow-after'
      break;
      case 'below':
        toolClass = 'tooltip-arrow-above'
      break;
      case 'left':
        toolClass = 'tooltip-arrow-right'
      break;
      case 'right':
        toolClass = 'tooltip-arrow-left'
      break;

      default:
        break;
    }

    return toolClass;
  }


  setClientWidthType(clientWidth: number): string {
      const smallBrake = config.clientWidthBrake.small;
      const middelBrake = config.clientWidthBrake.middel;

      const smallView = config.clientWidthTypes.small;
      const middelView = config.clientWidthTypes.middel;
      const wideView = config.clientWidthTypes.wide;

      let clientType: string;

      if (clientWidth < smallBrake) { clientType = smallView } else
      if (clientWidth >= smallBrake && clientWidth < middelBrake) { clientType = middelView} else
      if (clientWidth >= middelBrake) { clientType = wideView }

      return clientType;
  }

  setDeleteSnackBar(itemIdToArray: string[]): SnackBarModel {
    let snackBarModel = new SnackBarModel(
      snackBarConfig.message.undoAction,
      snackBarConfig.type.delete,
      snackBarConfig.action.undo,
      itemIdToArray
    );

    return snackBarModel;
  }

  isTouchDevice(): boolean {
    return this.detectUserAgentPlatformRegX.test(navigator.appVersion);
  }

  setFixedScrollPosition(renderer2: Renderer2) {
    const top = document.scrollingElement.getBoundingClientRect().top;
    let header = document.getElementById('header');
    // document.documentElement.style.position = 'fixed';
    document.documentElement.style.top = top + 'px';
    renderer2.addClass(document.documentElement, 'cdk-global-scrollblock')

    if (header) {
      renderer2.setStyle(header, 'top', '0')
    }
    // document.documentElement.style.top = top + 'px';

  }

  removeFixedScrollPosition(renderer2: Renderer2) {
    // document.documentElement.style.position = 'unset'
    // document.documentElement.style.top = 'unset'

    let header = document.getElementById('header');
    const top = document.scrollingElement.getBoundingClientRect().top;
    renderer2.removeStyle(document.documentElement, 'position');
    renderer2.removeStyle(document.documentElement, 'top');
    renderer2.removeClass(document.documentElement, 'cdk-global-scrollblock');
    if (header) {
      renderer2.removeStyle(header, 'top');
    }
    // setTimeout(() => {
      window.scrollTo(0, Math.abs(top));
    // }, 0)

    // document.documentElement.style.removeProperty('position');
    // document.documentElement.style.removeProperty('top');
  }

  ifFileisImage(file: File): boolean {
    return file && file['type'].split('/')[0] === 'image';
  }

  iconRegistry() {
    const domain = (isPlatformServer(this.platformId)) ? environment.appDomain : '';
    // console.log('icon registry: ' + domain);

    this._iconRegistry.addSvgIcon('home',
    this._sanitizer.bypassSecurityTrustResourceUrl('/assets/images/material/icon/baseline-home-24px.svg'));

    this._iconRegistry.addSvgIcon('notifications',
    this._sanitizer.bypassSecurityTrustResourceUrl('/assets/images/material/icon/bell.svg'));


    this._iconRegistry.addSvgIcon('back',
    this._sanitizer.bypassSecurityTrustResourceUrl(
       domain +
      '/assets/images/material/icon/navigate_before_24px.svg'));
    this._iconRegistry.addSvgIcon('next',
    this._sanitizer.bypassSecurityTrustResourceUrl(domain + '/assets/images/material/icon/navigate_next_24px.svg'));

    this._iconRegistry.addSvgIcon('closeSearch',
    this._sanitizer.bypassSecurityTrustResourceUrl(domain + '/assets/images/material/icon/ic_close_white_24px.svg'));
    this._iconRegistry.addSvgIcon('sidenav',
    this._sanitizer.bypassSecurityTrustResourceUrl(domain + '/assets/images/material/icon/ic_menu_24px.svg'));
    this._iconRegistry.addSvgIcon('upload',
    this._sanitizer.bypassSecurityTrustResourceUrl(domain + '/assets/images/material/icon/ic_file_upload_24px.svg'));
    this._iconRegistry.addSvgIcon('sidenavLeft',
    this._sanitizer.bypassSecurityTrustResourceUrl(domain + '/assets/images/material/icon/ic_keyboard_arrow_left_24px.svg'));
    this._iconRegistry.addSvgIcon('detailCaret',
    this._sanitizer.bypassSecurityTrustResourceUrl(domain + '/assets/images/material/icon/menu-down.svg'));
    this._iconRegistry.addSvgIcon('profile',
    this._sanitizer.bypassSecurityTrustResourceUrl(domain + '/assets/images/material/icon/ic_account_circle_24px.svg'));
    this._iconRegistry.addSvgIcon('logo',
    this._sanitizer.bypassSecurityTrustResourceUrl(domain + '/assets/images/material/temp-logo.svg'));
    this._iconRegistry.addSvgIcon('fb',
    this._sanitizer.bypassSecurityTrustResourceUrl(domain + '/assets/images/material/icon/facebook_just_f.svg'));
    this._iconRegistry.addSvgIcon('google',
    this._sanitizer.bypassSecurityTrustResourceUrl(domain + '/assets/images/material/icon/Google_-G-_Logo.svg'));
    this._iconRegistry.addSvgIcon('edit',
    this._sanitizer.bypassSecurityTrustResourceUrl(domain + '/assets/images/material/icon/ic_mode_edit_24px.svg'));
    this._iconRegistry.addSvgIcon('sort',
    this._sanitizer.bypassSecurityTrustResourceUrl(domain + '/assets/images/material/icon/ic_sort_black_24px.svg'));
    this._iconRegistry.addSvgIcon('twitter',
    this._sanitizer.bypassSecurityTrustResourceUrl(domain + '/assets/images/material/icon/twitter.svg'));
    this._iconRegistry.addSvgIcon('linkedin',
    this._sanitizer.bypassSecurityTrustResourceUrl(domain + '/assets/images/material/icon/linkedin-logo_in.svg'));
    this._iconRegistry.addSvgIcon('youtube',
    this._sanitizer.bypassSecurityTrustResourceUrl(domain + '/assets/images/material/icon/youtubeicon.svg'));
    this._iconRegistry.addSvgIcon('search',
    this._sanitizer.bypassSecurityTrustResourceUrl(domain + '/assets/images/material/icon/ic_search_white_24px.svg'));
    this._iconRegistry.addSvgIcon('backspace',
    this._sanitizer.bypassSecurityTrustResourceUrl(domain + '/assets/images/material/icon/outline-backspace-24px.svg'));

    this._iconRegistry.addSvgIcon('openFolder',
    this._sanitizer.bypassSecurityTrustResourceUrl(domain + '/assets/images/material/icon/folder_open-24px.svg'));

    this._iconRegistry.addSvgIcon('savealt',
    this._sanitizer.bypassSecurityTrustResourceUrl(domain + '/assets/images/material/icon/save-alt-24px.svg'));

    this._iconRegistry.addSvgIcon('share',
    this._sanitizer.bypassSecurityTrustResourceUrl(domain + '/assets/images/material/icon/share-24px.svg'));

    this._iconRegistry.addSvgIcon('caret',
    this._sanitizer.bypassSecurityTrustResourceUrl(domain + '/assets/images/material/icon/caret.svg'));

    this._iconRegistry.addSvgIcon('error',
    this._sanitizer.bypassSecurityTrustResourceUrl(domain + '/assets/images/material/icon/ic_error_outline_white_36px.svg'));
    this._iconRegistry.addSvgIcon('success',
    this._sanitizer.bypassSecurityTrustResourceUrl(domain + '/assets/images/material/icon/ic_check_white_36px.svg'));
    this._iconRegistry.addSvgIcon('info',
    this._sanitizer.bypassSecurityTrustResourceUrl(domain + '/assets/images/material/icon/ic_info_outline_white_36px.svg'));
    this._iconRegistry.addSvgIcon('close',
    this._sanitizer.bypassSecurityTrustResourceUrl(domain + '/assets/images/material/icon/ic_close_white_24px.svg'));
    this._iconRegistry.addSvgIcon('clear',
    this._sanitizer.bypassSecurityTrustResourceUrl(domain + '/assets/images/material/icon/ic_clear_black_18px.svg'));
    this._iconRegistry.addSvgIcon('portfolio',
    this._sanitizer.bypassSecurityTrustResourceUrl(domain + '/assets/images/material/icon/briefcase.svg'));
    this._iconRegistry.addSvgIcon('favourite',
    this._sanitizer.bypassSecurityTrustResourceUrl(domain + '/assets/images/material/icon/baseline_bookmark_border_24px.svg'));
    this._iconRegistry.addSvgIcon('favouriteFill',
    this._sanitizer.bypassSecurityTrustResourceUrl(domain + '/assets/images/material/icon/favourite_fill_24px.svg'));

    this._iconRegistry.addSvgIcon('logout',
    this._sanitizer.bypassSecurityTrustResourceUrl(domain + '/assets/images/material/icon/logout-variant.svg'));
    this._iconRegistry.addSvgIcon('moreHoriz',
    this._sanitizer.bypassSecurityTrustResourceUrl(domain + '/assets/images/material/icon/baseline-more_horiz-24px.svg'));
    this._iconRegistry.addSvgIcon('send',
    this._sanitizer.bypassSecurityTrustResourceUrl(domain + '/assets/images/material/icon/baseline-send-24px.svg'));
    this._iconRegistry.addSvgIcon('more_vert',
    this._sanitizer.bypassSecurityTrustResourceUrl(domain + '/assets/images/material/icon/baseline-more_vert-24px.svg'));
    this._iconRegistry.addSvgIcon('cloud-upload',
    this._sanitizer.bypassSecurityTrustResourceUrl(domain + '/assets/images/material/icon/outline-cloud_upload-24px.svg'));
    this._iconRegistry.addSvgIcon('cloud-upload-filled',
    this._sanitizer.bypassSecurityTrustResourceUrl(domain + '/assets/images/material/icon/baseline-cloud_upload-24px.svg'));
    this._iconRegistry.addSvgIcon('cursor-icon',
    this._sanitizer.bypassSecurityTrustResourceUrl(domain + '/assets/images/material/icon/cursor-32.svg'));
    this._iconRegistry.addSvgIcon('add-photo',
    this._sanitizer.bypassSecurityTrustResourceUrl(domain + '/assets/images/material/icon/outline-add_a_photo-24px.svg'));
    this._iconRegistry.addSvgIcon('commentIcon',
    this._sanitizer.bypassSecurityTrustResourceUrl(domain + '/assets/images/material/icon/baseline-comment-24px.svg'));
    this._iconRegistry.addSvgIcon('deleteIconOutline',
    this._sanitizer.bypassSecurityTrustResourceUrl(domain + '/assets/images/material/icon/outline-delete_outline-24px.svg'));
    this._iconRegistry.addSvgIcon('delete',
    this._sanitizer.bypassSecurityTrustResourceUrl(domain + '/assets/images/material/icon/baseline-delete-24px.svg'));
    this._iconRegistry.addSvgIcon('editIconOutline',
    this._sanitizer.bypassSecurityTrustResourceUrl(domain + '/assets/images/material/icon/outline-edit-24px.svg'));
    this._iconRegistry.addSvgIcon('undo',
    this._sanitizer.bypassSecurityTrustResourceUrl(domain + '/assets/images/material/icon/baseline-undo-24px.svg'));
    this._iconRegistry.addSvgIcon('arrowBack',
    this._sanitizer.bypassSecurityTrustResourceUrl(domain + '/assets/images/material/icon/baseline-arrow_back-24px.svg'));

    this._iconRegistry.addSvgIcon('viewStream',
    this._sanitizer.bypassSecurityTrustResourceUrl(domain + '/assets/images/material/icon/view_stream-24px.svg'));

    this._iconRegistry.addSvgIcon('viewGrid',
    this._sanitizer.bypassSecurityTrustResourceUrl(domain + '/assets/images/material/icon/baseline-view_module-24px.svg'));
    this._iconRegistry.addSvgIcon('viewColumn',
    this._sanitizer.bypassSecurityTrustResourceUrl(domain + '/assets/images/material/icon/baseline-view_column-24px.svg'));
    this._iconRegistry.addSvgIcon('viewCarousel',
    this._sanitizer.bypassSecurityTrustResourceUrl(domain + '/assets/images/material/icon/baseline-view_carousel-24px.svg'));
    this._iconRegistry.addSvgIcon('verticalLine',
    this._sanitizer.bypassSecurityTrustResourceUrl(domain + '/assets/images/material/icon/two-lines.svg'));
    this._iconRegistry.addSvgIcon('check',
    this._sanitizer.bypassSecurityTrustResourceUrl(domain + '/assets/images/material/icon/check.svg'));
    this._iconRegistry.addSvgIcon('image',
    this._sanitizer.bypassSecurityTrustResourceUrl(domain + '/assets/images/material/icon/outline-photo-24px.svg'));
    this._iconRegistry.addSvgIcon('description',
    this._sanitizer.bypassSecurityTrustResourceUrl(domain + '/assets/images/material/icon/description.svg'));

    
    // return domain;
  }
}

