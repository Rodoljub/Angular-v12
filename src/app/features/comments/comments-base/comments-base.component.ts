import { Component, Input } from '@angular/core';
import { BaseItemComponent } from '../../items/base-item/base-item.component';
import { EventService } from '../../../services/utility/event.service';
import { Router } from '../../../../../node_modules/@angular/router';
import { ReportedContentService } from '../../../services/rs/reported-content.service';
import { CommonResponseService } from '../../../services/utility/common-response.service';
import { CommentService } from '../../../services/rs/comment.service';
import { UtilityService } from '../../../services/utility/utility.service';
import { FormBuilder } from '@angular/forms';
import { config } from '../../../../config/config';
import { SnackBarService } from '../../common/snack-bar/snack-bar.service';
import { OidcService } from '../../accounts/services/oidc.service';
import { TooltipPosition } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-comments-base',
  templateUrl: './comments-base.component.html',
  styles: []
})
export class CommentsBaseComponent extends BaseItemComponent {

  commentInputValue = '';

  placeholderAddComment = config.inputPlaceholders.addComment;
  placeholderAddReply = config.inputPlaceholders.addReply;
  placeholderEdit = config.inputPlaceholders.edit;

  commentsIconTooltip = config.tooltips.comments
  aboveTooltipPosition: TooltipPosition = 'above';

  showHideComments: string;
  @Input() itemId: string;
  @Input() isMobileView: boolean;

  _snackBarService: SnackBarService;
  _eventService: EventService;
  _router: Router;
  _utilityService: UtilityService;

  constructor(
    oidcService: OidcService,
    eventService: EventService,
    router: Router,
    matDialog: MatDialog,
    reportedContentService: ReportedContentService,
    commonResponseService: CommonResponseService,
    utilityService: UtilityService,
    snackBarService: SnackBarService,
    private formBuilder: FormBuilder,
    private commentService: CommentService,
  ) {
    super( oidcService, eventService, router, matDialog,
      reportedContentService, commonResponseService, utilityService, snackBarService);

      this._snackBarService = snackBarService;
      this._eventService = eventService;
      this._router = router;
      this._utilityService = utilityService;
  }

  redirectToLogin() {
    this._utilityService.redirectToLogin(this.itemId);
  }
}
