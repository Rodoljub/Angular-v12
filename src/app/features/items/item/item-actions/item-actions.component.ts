import { Component, OnInit, ViewChild,
  ElementRef, Input, Inject, PLATFORM_ID, Output,
  EventEmitter, OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { config } from '../../../../../config/config';
import { environment } from '../../../../../environments/environment';
import { UtilityService } from '../../../../services/utility/utility.service';
import { iconConfig } from '../../../../../config/iconConfig';
import { Router } from '@angular/router';
import { EventService } from '../../../../services/utility/event.service';
import { ReportedContentService } from '../../../../services/rs/reported-content.service';
import { CommonResponseService } from '../../../../services/utility/common-response.service';
import { BaseItemComponent } from '../../base-item/base-item.component';
import { ItemViewModel } from '../ItemViewModel';
import { SnackBarService } from '../../../common/snack-bar/snack-bar.service';
import { ActionIconViewModel } from './ActionIconViewModel';
import { OidcService } from '../../../accounts/services/oidc.service';
import { TooltipPosition } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-item-actions',
  templateUrl: './item-actions.component.html',
  styleUrls: ['item-actions.component.scss']
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemActionsComponent extends BaseItemComponent implements OnInit, OnChanges {


  @Input() item: ItemViewModel;
  @Input() isMobileView: boolean;
  @Input() typeOfItemsList: string;
  @Input() typeOfViewType: string;
  @Input() doubleTapTrigger: boolean;
  @Input() doubleTapAction: boolean;

  @Output() clickOnCommentOut = new EventEmitter();
  @Output() updateItem = new EventEmitter<ItemViewModel>();
  @Output() clickOnDescription = new EventEmitter<boolean>();

  settingsTooltipPosition: TooltipPosition;

  tooltipShowDelay = config.tooltips.showDelay;


  portfolioItemList = config.itemsListsTypes.portfolio;
  gridViewItem = config.listViewTypes.grid;

//#region View Child
  settingsIcon: string;
  settingsIconTooltip: string;
  @ViewChild('settingsIconPath', {static: false}) settingsIconPath: ElementRef;
  commentsIcon = iconConfig.baselineComment;
  commentsIconTooltip = config.tooltips.comments
  @ViewChild('commentIconPath', {static: false}) commentIconPath: ElementRef;
//#endregion  View Child

  settingsTooltipClass = ['item-settings-tooltip'];
  // ['header-tooltip'];

  actionIconCouterTooltipsPosition: TooltipPosition = 'above';
  actionIconCouterTooltipsClass = ['']

  aboveTooltipPosition: TooltipPosition = 'above';
  rightTooltipPosition: TooltipPosition = 'right';

  actionIconCouterClasses = [config.actionIconStrokeClass, config.actionIconFillClass];

  itemEntityTypeName = config.entityTypesNames.item;

//#region Favourite
  actionFavouriteIconCouterTooltips = [config.tooltips.unfavouriteTooltip, config.tooltips.favouriteTooltip];
  inputHtmlSvgIconFavourite = iconConfig.favourite;
  clickItemFavouriteTrigger: boolean;
  favouriteApi = `${environment.rsURi}/api/Favourites`;
  favouriteActionType = config.actionIconTypes.favourite;
//#endregion Favourite

//#region Like
  actionLikeIconCouterTooltips = [config.tooltips.unlikeTooltip, config.tooltips.likeTooltip];
  inputHtmlSvgIconLike = iconConfig.like;
  clickItemLikeTrigger: boolean;
  likeApi = `${environment.rsURi}/api/Likes`;
  likeEntityTypeName = config.entityTypesNames.item;
  likeActionType = config.actionIconTypes.like;
//#endregion Like

  shareIcon = iconConfig.share;
  shareIconTooltip = config.tooltips.shareTooltip;
  @ViewChild('shareMenuTrigger', {static: false}) shareMenuTrigger: MatMenuTrigger;
  @ViewChild('shareMenu', {static: false}) shareMenu: MatMenu;

  descriptionIconPath = iconConfig.descriptionIconPath;
  descriptionIconPathTooltip = config.tooltips.descriptionTooltip;


// #region Edit
  editIcon = 'edit';
  editTooltip = '';
//#endregion Edit

_oidcService: OidcService;
_eventService: EventService;
_utilityService: UtilityService;
  description: string;
  isDescription = false;
  flipImage = false;

  constructor(
    router: Router,
    oidcService: OidcService,
    matDialog: MatDialog,
    reportedContentService: ReportedContentService,
    commonResponseService: CommonResponseService,
    snackBarService: SnackBarService,
    utilityService: UtilityService,
    eventService: EventService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private chamgeDetectorRef: ChangeDetectorRef,
    private renderer2: Renderer2
  ) {
    super(
      oidcService,
      eventService,
      router,
      matDialog,
      reportedContentService,
      commonResponseService,
      utilityService,
      snackBarService
    );

    this._oidcService = oidcService;
    this._eventService = eventService;
    this._utilityService = utilityService;
   }


  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.isMobileView) {
        this.settingsTooltipPosition = this.rightTooltipPosition;
      } else {
        this.settingsTooltipPosition = this.aboveTooltipPosition;
      }
      this.actionIconCouterTooltipsClass = [];

      if (this.item.UserProfile.userEntityOwner) {
        this.settingsIcon = iconConfig.baselineSettings;
        this.settingsIconTooltip = config.tooltips.settings;
      } else {
        this.settingsIcon = iconConfig.flagReport;
        this.settingsIconTooltip = config.tooltips.report;
      }

      if (this.item.Description === null) {
        this.description = '';
      } else {
        this.description = this.item.Description
      }

      if (this.description.trim().length > 0 && this.typeOfViewType !== config.listViewTypes.grid) {
        this.isDescription = true;
      } else {
        this.isDescription = false;
      }
      // const toolClass = this._utilityService.setTooltipClass(this.actionIconCouterTooltipsPosition);
      // this.actionIconCouterTooltipsClass.push(toolClass);
      // this.settingsIconPath.nativeElement.innerHTML = iconConfig.baselineSettings;
      // this.commentIconPath.nativeElement.innerHTML = iconConfig.baselineComment;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.doubleTapTrigger) {
      if (changes.doubleTapTrigger.currentValue !== changes.doubleTapTrigger.previousValue) {
        if (!this.item.UserLiked) {
          this.clickOnActionIcon(this.likeActionType);
        } else {
          if (this.userAuthenticated) {
          } else {

            this.redirectToLogin(this.item.Id);
          }
        }
      }
    }
  }

  openShareMenu() {
    // this._utilityService.setFixedScrollPosition(this.renderer2);
    //     setTimeout(() => {
            this.shareMenuTrigger.openMenu();
            // let el = document.getElementsByClassName('search-menu')[0].parentElement;
            // this.renderer2.setStyle(el, 'width', '100%');
            // this.renderer2.setStyle(el, 'right', '0');


            // this._renderer2.setStyle(el, 'bottom', '50px');

            // 'calc(100vh - 88px)');

        // }, 100)

  }

  onMenuClose() {
    // this._utilityService.removeFixedScrollPosition(this.renderer2);
  }

  openItemDialog() {
    super.openDialog(this.itemEntityTypeName, this.item.Id, this.item.UserProfile.userEntityOwner, this.item.Id);
  }

  clickOnActionIcon(actionType: string) {
    if (this.userAuthenticated) {
      switch (actionType) {
        case  this.favouriteActionType:
          this.clickItemFavouriteTrigger = this.clickItemFavouriteTrigger ? false : true;
          break;

        case this.likeActionType:
          this.clickItemLikeTrigger = this.clickItemLikeTrigger ? false : true;
          break;

        default:
          break;
      }
    } else {

      this.redirectToLogin(this.item.Id);
    }
  }

  onMouseHoverEditEvent(event: boolean) {
    if (!this.isMobileView) {
      if (event) {
        this.editTooltip = config.tooltips.editTooltip;
        // this.editIcon = 'edit';
      } else {
        this.editTooltip = '';
        // this.editIcon = 'editIconOutline';
      }
    }
  }

  // itemEditMode(event) {
  //   event.stopPropagation();
  //   // this.router.navigate([{outlets: 'upload'}, {data: this.item}]);
  //   this._eventService.setItemEditMode(this.item);
  // }


  clickOnComment() {
    this.clickOnCommentOut.emit();
  }

  onUserActionFavourite(actionIcon: ActionIconViewModel) {
    this.item.UserFavourite = actionIcon.userAction;
    this.item.FavouritesCount = actionIcon.actionCount;
    this.updateItem.emit(this.item);
    this.chamgeDetectorRef.detectChanges();
  }

  onUserActionLike(actionIcon: ActionIconViewModel) {
    this.item.UserLiked = actionIcon.userAction;
    this.item.LikesCount = actionIcon.actionCount;
    this.chamgeDetectorRef.detectChanges();
    this.updateItem.emit(this.item);
  }

  clickOnDescrpiton() {
    this.flipImage = this.flipImage ? false : true;
    this.clickOnDescription.emit(this.flipImage);
  }


}
