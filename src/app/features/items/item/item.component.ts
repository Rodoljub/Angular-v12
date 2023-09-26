import {
  Component, OnInit, Input, OnDestroy, Inject,
  PLATFORM_ID, Renderer2, ViewChild, ElementRef, HostBinding,
  AfterViewInit, ChangeDetectorRef, OnChanges, SimpleChanges,
  HostListener, DoCheck, ChangeDetectionStrategy, Output, EventEmitter
} from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { FavouritesListDndService } from '../../../services/rs/favourites-list-dnd.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { BaseItemComponent } from '../base-item/base-item.component';
import { EventService } from '../../../services/utility/event.service';
import { isPlatformBrowser, isPlatformServer } from '../../../../../node_modules/@angular/common';
import { ReportedContentService } from '../../../services/rs/reported-content.service';
import { CommonResponseService } from '../../../services/utility/common-response.service';
import { SafeStyle, DomSanitizer, SafeUrl } from '@angular/platform-browser';
import {  itemTranslateAnimation, detailCardArrowIconAnimation } from '../../../animation/animation';
import { UtilityService } from '../../../services/utility/utility.service';
import { config } from '../../../../config/config';
import { ImagesService } from '../../../services/rs/images.service';
import { SnackBarService } from '../../common/snack-bar/snack-bar.service';
import { OidcService } from '../../accounts/services/oidc.service';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';

@Component({
  selector: '[app-item]',
  templateUrl: './item.component.html',
  styleUrls: ['item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
  ],
  animations: [
    itemTranslateAnimation,
    detailCardArrowIconAnimation
  ]
})

export class ItemComponent extends BaseItemComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {

//#region Inputs
  @Input() index: number;
  @Input() typeOfItemsList: string;
            isMobileView: boolean;
  @Input() currentViewType: string;
  @Input() gridColumnWidth: number;
  @Input() itemWallCardWidth: number;
  @Input() translate: number;
  @Input() changingSize: Subject<boolean>;
//#endregion Inputs
itemUrl: SafeUrl;

flipImage = false;

  @Output() openModalItemEmitter = new EventEmitter<number>();

  changingSizeSubscription: Subscription;

doubleTapTrigger: boolean;
doubleTapAction = false;

portfolioItemList = config.itemsListsTypes.portfolio;

itemEntityTypeName = config.entityTypesNames.item;

//#region View Types
  gridViewItem = config.listViewTypes.grid;
  wallViewItem = config.listViewTypes.wall;
//#endregion View Types

  itemCardPadding = config.itemCard.padding;
  imageHeight: number;

//#region ViewChild
  @ViewChild('cardElement', {static: false}) cardElement: ElementRef;
  @ViewChild('itemInfoElement', {static: false}) itemInfoElement: ElementRef;
  @ViewChild('itemTagsElement', {static: false}) itemTagsElement: ElementRef;
//#endregion ViewChild

  @HostBinding('style') style: SafeStyle

//#region Drag N Drop
  isItemPickedUpSubscription: Subscription;
  isItemPickedUp: boolean;
  draggableAttribute = false;
//#endregion Drag N Drop

  itemTranslated = false;

//#region Hover Element
itemTagTranslateAnimationState = 'up';
itemActionTranslateAnimationState = 'down';
//#endregion  Hover Element

  detectUserAgentPlatformRegX = new RegExp(config.detectUserAgentPlatformRegX);

  // itemCommentViewModel: CommentViewModel[] = [];

  itemDropSectionClass = '';
  itemCardClass = '';
  itemImageWallClass = '';

  showComments = false;

//#region Super Constructor
  _eventService: EventService;
  _router: Router;
  _utilityService: UtilityService;
  _snackBarService: SnackBarService;
  desktopHover: boolean;
  itemCardHeight: any;
  itemTagsHeight: any;

//#endregion Super Constructor

//#region Constructor
  constructor(
    eventService: EventService,
    router: Router,
    private route: ActivatedRoute,
    private imagesService: ImagesService,
    snackBarService: SnackBarService,
    private favouritesListDndService: FavouritesListDndService,
    oidcService: OidcService,
    @Inject(PLATFORM_ID) private platformId: Object,
    matDialog: MatDialog,
    reportedContentService: ReportedContentService,
    commonResponseService: CommonResponseService,
    private changeDetectorRef: ChangeDetectorRef,
    private renderer2: Renderer2,
    utilityService: UtilityService,
    private sanitizer: DomSanitizer
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

    this._eventService = eventService;
    this._router = router;
    this._utilityService = utilityService;
    this._snackBarService = snackBarService;
  }
  //#endregion Constructor

  @HostListener('window:resize')
  onWindowResize() {
    this.isMobileView = this.detectUserAgentPlatformRegX.test(navigator.appVersion);
    if (!this.isMobileView) {
      // this.itemCardClass = 'item-card-item-path';
    }

    this.setItemHoverDesktop()
  }

  setItemHoverDesktop() {
    let clientWidth = document.scrollingElement.clientWidth;
    if (clientWidth > 1200) {
      this.desktopHover = true;
    } else {
      this.desktopHover = false;
    }
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobileView = this.detectUserAgentPlatformRegX.test(navigator.appVersion);
      if (this.item) {
        let url = environment.appDomain + '/(a:aa/' + this.item.Id + ')';
        this.itemUrl = this.sanitizer.bypassSecurityTrustUrl(url);
        this.setItemHoverDesktop()
        this.setItem();
      }

      this.isItemPickedUpSubscription = this.favouritesListDndService.getIsItemPickedUp()
        .subscribe(data => {
          this.isItemPickedUp = data;
        });

        if (this.changingSize) {
          this.changingSizeSubscription = this.changingSize.subscribe(v => {
            this.setItemElement();
         });
        }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.translate && !changes.translate.firstChange) {
      if (changes.translate.currentValue !== changes.translate.previousValue) {
        this.showComments = false;
        this.setItemElement();
      }
    }

    if (changes.currentViewType) {
      if (changes.currentViewType.currentValue !== changes.currentViewType.previousValue) {
        if (changes.currentViewType.currentValue === this.wallViewItem) {
          this.itemImageWallClass = 'item-image-wall'
        } else {
          this.itemImageWallClass = '';
        }
      }
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.item) {
        this.setItemElement();
      }
    }
  }

  ngOnDestroy() {
    if (this.isItemPickedUpSubscription) {
      this.isItemPickedUpSubscription.unsubscribe();
    }

    if (this.changingSizeSubscription) {
      this.changingSizeSubscription.unsubscribe();
    }
  }


  setItemElement() {
    switch (this.currentViewType) {
      case this.wallViewItem:
        this.setWallItemElement();
        break;
      case this.gridViewItem:
        this.setGridItemElement();
        break;
      default:
        break;
    }


      this.style = this.sanitizer
      // tslint:disable-next-line:max-line-length
      .bypassSecurityTrustStyle('transform: translate(' + this.item.TranslateX + 'px, ' + this.item.TranslateY + 'px);width:' + this.gridColumnWidth + 'px');
      // this.changeDetectorRef.detectChanges();

    this.itemTranslated = true;
  }

  setWallItemElement(): any {

    this.itemWallCardWidth = document.getElementById('wallItemColumnElement').clientWidth;

    this.imageHeight = this.itemWallCardWidth / (this.item.FileDetails.width / this.item.FileDetails.height);

   setTimeout(() => {
     this.showComments = true;
   }, 0)
  }

  setGridItemElement(): any {
    this.imageHeight = (this.gridColumnWidth - this.itemCardPadding) / (this.item.FileDetails.width / this.item.FileDetails.height);
    this.renderer2.setStyle(this.cardElement.nativeElement, 'min-height', this.imageHeight + 'px');

  }

  openCarouselItem(event) {
      if (this.currentViewType !== config.listViewTypes.carousel) {
        this.openModalItemEmitter.emit(this.index);
      }
  }

  onUpdateItem(event) {
    this.item = event;
  }

  onMouseHoverEvent(event: boolean) {
    if (!this.isMobileView) {
      if (event) {
        this.itemTagTranslateAnimationState = 'in'
        this.itemActionTranslateAnimationState = 'in';
      } else {
        this.itemTagTranslateAnimationState = 'up'
        this.itemActionTranslateAnimationState = 'down';
      }
    }
  }

  onMouseDownDraggable() {
    this.draggableAttribute = true;
  }

  doubleTapLike(event) {
    this.doubleTapTrigger = this.doubleTapTrigger ? false : true;
  }

  deleteItem(event) {
    this.deleteEntity.emit(event);
  }

  clickOnDescription(event) {
    this.flipImage = event;
  }

}
