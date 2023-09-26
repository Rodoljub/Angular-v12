import { Component, OnInit, PLATFORM_ID, Inject, ChangeDetectionStrategy,
  Input, ViewEncapsulation, HostListener, Renderer2, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { EventService } from '../../../../services/utility/event.service';
import { ReportedContentService } from '../../../../services/rs/reported-content.service';
import { CommonResponseService } from '../../../../services/utility/common-response.service';
import { UtilityService } from '../../../../services/utility/utility.service';
import { config } from '../../../../../config/config';
import { itemTranslateAnimation } from '../../../../animation/animation';
import { BaseItemComponent } from '../../base-item/base-item.component';
import { SnackBarService } from '../../../common/snack-bar/snack-bar.service';
import { OidcService } from '../../../accounts/services/oidc.service';


@Component({
    selector: 'app-item-modal',
    templateUrl: './item-modal.component.html',
    styleUrls: ['item-modal.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
      itemTranslateAnimation
    ]
})

export class ItemModalComponent extends BaseItemComponent implements OnInit, OnChanges {
    @Input() isMobileView: boolean;
    @Input() typeOfItemsList: string;
    @Input() index: number;
    // @Input() item: ItemViewModel;
    @Input() showDetails = true;
    @Input() clientScreenWide = false;

    @Output() hideDetails = new EventEmitter();
    @Output() closeItemEmit = new EventEmitter();

    // itemCommentViewModel: CommentViewModel[] = [];

    carouselView = config.listViewTypes.carousel;

    itemTagTranslateAnimationState = 'in';
    itemActionTranslateAnimationState = 'in';

    currentViewType = config.listViewTypes.wall;

    commentCardAbsoluteClass = '';
    hideComments = true;

    doubleTapTrigger: boolean;
    doubleTapAction = false;

    flipImage = false;


    _eventService: EventService;

    constructor(
        eventService: EventService,
        router: Router,
        snackBarService: SnackBarService,
        oidcService: OidcService,
        @Inject(PLATFORM_ID) private platformId: Object,
        matDialog: MatDialog,
        reportedContentService: ReportedContentService,
        commonResponseService: CommonResponseService,
        utilityService: UtilityService,
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
     }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
          this.setItem();
        }
    }

    ngOnChanges(changes: SimpleChanges) {
      if (changes.clientScreenWide) {
        if (changes.clientScreenWide.currentValue !== changes.clientScreenWide.previousValue) {
          if (this.clientScreenWide) {
            this.commentCardAbsoluteClass = 'comment-card-absolute';
            this.hideComments = false;
          } else {
            this.commentCardAbsoluteClass = '';
            this.hideComments = true;
          }
        }
      }
    }

    doubleTapLike(event) {
      this.doubleTapTrigger = this.doubleTapTrigger ? false : true;
    }

    onCloseDetailItem(event) {
      this._eventService.setUpdateItemInList(this.item);
      this.closeItemEmit.emit();
    }

    showAndFocusComment() {
      this.hideComments = false;
      this.showDetails = false;
      this.hideDetails.emit();
      // setTimeout(() => {this.onClickOnComment()}, 50);
    }

    stopPropagation(event) {
      event.stopImmediatePropagation();
    }

    clickOnCommentsArrowBack() {
      if (!this.clientScreenWide) {
        this.hideComments = true;
      }
    }

    deleteItem(event) {
      this.deleteEntity.emit(event);
    }

    clickOnDescription(event) {
      this.flipImage = event;
    }
}
