import {
  Component, OnInit, Input, ElementRef, Inject,
  ViewChild, AfterViewInit, SimpleChanges, OnChanges, Output, EventEmitter,
  PLATFORM_ID, ChangeDetectorRef, ChangeDetectionStrategy, ViewEncapsulation
} from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { CommentsBaseComponent } from '../comments-base/comments-base.component';
import { CommentViewModel } from '../CommentViewModel';
import { environment } from '../../../../environments/environment';
import { config } from '../../../../config/config';
import { EventService } from '../../../services/utility/event.service';
import { CommentService } from '../../../services/rs/comment.service';
import { UtilityService } from '../../../services/utility/utility.service';
import { CommonResponseService } from '../../../services/utility/common-response.service';
import { isPlatformBrowser } from '../../../../../node_modules/@angular/common';
import { Observable, Subscription } from 'rxjs';
import { ReportedContentService } from '../../../services/rs/reported-content.service';
import { iconConfig } from '../../../../config/iconConfig';
import { UserProfileModel } from '../../accounts/models/UserProfileModel';
import { ReportedContentReasonModel } from '../../../features/models/ReportedContentReasonModel';
import { SnackBarService } from '../../common/snack-bar/snack-bar.service';
import { DialogDataModel } from '../../common/mat-dialog/DialogDataModel';
import { MatDialogComponent } from '../../common/mat-dialog/mat-dialog.component';
import { CommentModel } from '../CommentModel';
import { ActionIconViewModel } from '../../items/item/item-actions/ActionIconViewModel';
import { OidcService } from '../../../features/accounts/services/oidc.service';
import { Store } from '@ngrx/store';
import { AppState, selectProfileState } from '../../../store/app.state';
import { ProfileDetailsModel } from '../../../features/profile-details/ProfileDetailsModel';
import { ActionIconModel } from 'app-action-icon';
import { TooltipPosition } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: '[app-comment]',
  templateUrl: './comment.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
  ]
})
export class CommentComponent extends CommentsBaseComponent implements OnInit, AfterViewInit, OnChanges {

  sendReplay = false;
  // replyForm: FormGroup

  comments: CommentViewModel[] = [];
  reply: CommentViewModel;
  replies: CommentViewModel[] = []

  //#region Inputs
  @Input() comment: CommentViewModel;

  getProfileState: Observable<ProfileDetailsModel>;



  @Input() replyBool: boolean;
  @Input() replysCount = 0;
  @Input() hasReplys = false;

  @Input() commentParentId: string;
  @Input() commentType = false;

  @Input() reportedContentReasons: ReportedContentReasonModel[];
  //#endregion Inputs

  //#region ViewChild
  @ViewChild('content', {static: false}) elementView: ElementRef;
  //#endregion ViewChild

  //#region Class
  commentContentExpandedClass = '';
  expandedReplyContentClass = '-expanded';
  repliesArrowIconClass = '';
  //#endregion Class

  showMoreCommentContent = false;
  isCommentContentExpandedBool = true;
  moreLessCommentContent = '...Show more';

  defaultProfilPic = config.defaultProfilePicture;
  userImage: string;
  userImageOwner: string;

  isReplyInputOpen = false;
  dontShowMoreOnAddedReply = false;

  commentId: string;

//#region Labels
  showReply = config.showReply;
  showReplies = config.showReplies;
  showMoreReplies = config.showMoreReplies;
  hideReply = config.hideReply;
  hideReplies = config.hideReplies;

  replyButtonLabel = config.replyButtonLabel;
//#endregion Labels

  inlineShowHideReply = true;


  showReplysBool = false

  contentHidden = true;

  replyStopList = false;

  commentsProgresBar: boolean;
  ownerComment = false;

  isEditComment = false;
  sendEditComment = false;

  //#region Outputs
  @Output() replyUpdate = new EventEmitter();
  @Output() updatedComments = new EventEmitter<CommentViewModel[]>();
  @Output() updatedComment = new EventEmitter<CommentViewModel>();

  //#endregion Outputs

  //#region Comment Like
  itemLikesCount: number;
  itemLikedInput = false;
  likeViewModel: ActionIconModel;
  likeIcon = config.likeIcon;
  clickItemLikeTrigger: boolean;
  actionIconCouterClasses = [config.actionIconStrokeClass, config.actionIconFillClass];
  actionLikeIconCouterTooltips = [config.tooltips.unlikeTooltip, config.tooltips.likeTooltip];
  inputHtmlSvgIconLike = iconConfig.like;
  likeApi = `${environment.rsURi}/api/Likes`;
  commentEntityTypeName = config.entityTypesNames.comment;
  likeActionType = config.actionIconTypes.like;

  actionIconCouterTooltipsPosition: TooltipPosition = 'above';
  actionIconCouterTooltipsClass = ['']

  // commentLikedClass = '';
  // commentLiked = false;
  //#endregion Comment Like

  //#region Subscriptions
  reportedCommentSubscription: Subscription;
  //#endregion Subscriptions

  //#region Super Constructor
  _oidcService: OidcService;
  _eventService: EventService;
  _router: Router;
  _commentService: CommentService;
  _utilityService: UtilityService;
  _snackBarService: SnackBarService;
  _matDialog: MatDialog
  //#endregion Super Constructor

  //#region Constructor
  constructor(
    private store: Store<AppState>,
    router: Router,
    commentService: CommentService,
    eventService: EventService,
    utilityService: UtilityService,
    formBuilder: FormBuilder,
    oidcService: OidcService,
    commonResponseService: CommonResponseService,
    snackBarService: SnackBarService,
    matDialog: MatDialog,
    reportedContentService: ReportedContentService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    super( oidcService, eventService, router,
      matDialog, reportedContentService,
      commonResponseService, utilityService, snackBarService, formBuilder, commentService);

    this._oidcService = oidcService;
    this._eventService = eventService;
    this._router = router;
    this._commentService = commentService;
    this._utilityService = utilityService;
    this._snackBarService = snackBarService;
    this._matDialog = matDialog;

    this.getProfileState = this.store.select(selectProfileState);

  }
  //#endregion Constructor


  // @HostListener('window:resize', ['$event'])
  // onResize() {
  //   if (isPlatformBrowser(this.platformId)) {
  //     this.setViewOnResize();
  //   }
  // }

  // setViewOnResize() {
  //   let clientWidth = document.body.clientWidth;
  //   if (clientWidth > 961) {
  //     this.inlineShowHideReply = true;
  //   } else {
  //     this.inlineShowHideReply = false;
  //   }
  // }

//#region Life Cicle
  ngOnInit() {

    if (isPlatformBrowser(this.platformId)) {
      // this.setViewOnResize();

      this.actionIconCouterTooltipsClass = []
      const toolClass = this._utilityService.setTooltipClass(this.actionIconCouterTooltipsPosition);
      this.actionIconCouterTooltipsClass.push(toolClass);

      this.getProfileState.subscribe((profile) => {
        if (profile && profile.imagePath !== null) {
          this.userImageOwner = profile.imagePath;
        } else {
          this.userImageOwner = this.defaultProfilPic;
        }
      });

      // if (this.comment.Replies) {
      //   this.replies = this.comment.Replies;
      //   this.replyBool = true;
      // }

      if (this.comment.UserProfile.userImagePath === null) {
        this.userImage = this.defaultProfilPic;
      } else {
        this.userImage = this.comment.UserProfile.userImagePath;
      }

      if (this.comment.UserProfile.userEntityOwner) {
        this.ownerComment = true;
      }

      if (this.comment.ChildCount > 0) {
        this.hasReplys = true;
        if (this.comment.ChildCount === 1) {
          this.showHideComments = this.showReply;
        } else {
          this.showHideComments = this.showReplies;
        }

        if (this.comment.ChildCount === this.replies.length) {
          if (this.comment.ChildCount === 1) {
            this.showHideComments = this.hideReply;
          } else {
            this.showHideComments = this.hideReplies;
          }
        }
      }


      if (this.commentType === true) {
        this.commentId = this.comment.Id;
      } else {
        this.replyBool = true;
        this.replyStopList = true;
      }


      this.reportedCommentSubscription = this._eventService.getReportedComment()
        .subscribe(data => {

          let reportedReply = this.replies.find(item => item.Id === data)
          if (reportedReply !== undefined) {
            let index = this.replies.indexOf(reportedReply)
            if (index !== -1) {
              this.replies.splice(index, 1);
              this.replysCount = this.replysCount - 1
            }
          }
        })
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      let viewHeight = this.elementView.nativeElement.offsetHeight;
      if (viewHeight > config.commentMaxInitialViewHeight) {

        this.showMoreCommentContent = true;
        this.commentContentExpandedClass = '';
      }
      this.contentHidden = false;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.replysCount) {
      if (this.replysCount === 0) {
        if (changes.replysCount.currentValue !== changes.replysCount.previousValue) {
          this.hasReplys = false;
        }
      }
    }
  }
//#endregion Life Cicle

  openCommentDialog(entityTypeName: string, entityId: string, entityOwner: boolean, itemId?: string, comment?: CommentViewModel) {
    if (this.userAuthenticated) {

      this.reportedEntityId = entityId;
      this.reportedEntityType = entityTypeName;

      if (this.reportedEntityId !== '') {

        const dialogData = new DialogDataModel(
          entityTypeName,
          entityId,
          entityOwner,
          comment
        )

        const dialogType = config.dialog.type.entity;

        let matDialogRef = this._matDialog.open(MatDialogComponent, {
          data: {
            dialogType,
            dialogData
          }
        });

        matDialogRef.afterClosed().subscribe(result => {
          switch (result) {
            case config.labels.dialogMenu.delete:
              this.deleteEntity.emit(this.reportedEntityId);
              break;

            case config.labels.dialogMenu.edit:
              this.editComment();
              break;

            default:
              break;
          }
        })
      }
    } else {
      this.redirectToLogin()
    }
  }

  editComment() {
    this.isEditComment = true;
    this.changeDetectorRef.detectChanges();
  }

  toggleMoreLess() {

    if (this.isCommentContentExpandedBool === false) {
      this.commentContentExpandedClass = '';
      this.moreLessCommentContent = '...Show more';
      this.isCommentContentExpandedBool = true;
    } else {
      this.commentContentExpandedClass = '-expanded'
      this.moreLessCommentContent = 'Show less';
      this.isCommentContentExpandedBool = false;
    }
  }

//#region Add Reply
  addReply(replyInputValue) {

      this.sendReplay = true;
      if (this.commentParentId === undefined) {
        this.commentParentId = this.commentId;
      }

      //#region Comment Model
      let commentModel = new CommentModel(
        this.commentParentId,
        config.entityTypesNames.comment,
        replyInputValue
      )
      //#endregion Comment Model

      this._commentService.addComment(commentModel)
        .then(response => {

          if (response.id !== undefined) {

            if (this.replyStopList === true) {
              this.replyUpdate.emit(response);
            } else {
              this.dontShowMoreOnAddedReply = true;
              this.replyUpdated(response);
            }

            this.replyResponse();
            this.isReplyInputOpen = false;
          } else {
            this._snackBarService.popMessageError('Something went wrong, try add comment again.');
          }
          this.sendReplay = false;
        })
        .catch(errorResp => {
          if (errorResp.status === 401) {
            this.redirectToLogin();
          }
          this.sendReplay = false;
        });
  }

  replyUpdated(response) {
    let viewReply: CommentViewModel = this._utilityService.mapJsonObjectToObject<CommentViewModel>(response);
    this.replies.unshift(viewReply)
    this.comment.ChildCount = this.comment.ChildCount + 1;

    // this.comment.Replies = this.replies;
    this.updatedComment.emit(this.comment);
  }

  private replyResponse() {
    this.hasReplys = true;
    if (this.replies.length === 1) {
      this.showHideComments = this.hideReply;
    } else {
      this.showHideComments = this.hideReplies;
    }

    this.showReplysBool = true;
    this.expandedReplyContentClass = '-expanded';
    this.replyBool = true;
    this.commentInputValue = '';
  }
//#endregion Add Reply

//#region Delete Comment Reply
  deleteReply(commentId) {
    this.replies = this.replies.filter(replies => replies.Id !== commentId);

    if (this.replysCount > 0) {
      this.replysCount = this.replysCount - 1;
    }

    if (this.replysCount === 0) {
      this.hasReplys = false;
    } else {
      if (this.replies.length === 0) {
        this.showReplysBool = false;
        if (this.replysCount === 1) {
          this.showHideComments = this.showReply;
        } else {
          this.showHideComments = this.showReplies;
        }
      }
    }

    this.updatedComments.emit(this.replies);
  }

  deleteComment(event) {
    let id = event;

    this._commentService.deleteComment(id)
      .then(response => {
        if (response) {
            this.deleteReply(id);
        }
      })
      .catch(errorResp => {
        if (errorResp.status === 401) {
          this.redirectToLogin();
        }
        this._snackBarService.popMessageError(errorResp.Error[0])
      })
  }

//#endregion Delete Comment Reply

//#region Show Hide Replies
  showReplys() {
    let id = this.comment.Id
    if (this.dontShowMoreOnAddedReply === true) {
      this.replies = [];
    }
    if (this.replysCount > this.replies.length && this.replysCount > 0
      // && this.showReplysBool === false
    ) {

      let skip = this.replies.length;
      this.commentsProgresBar = true;
      this.dontShowMoreOnAddedReply = false;

      this._commentService.getComments(this.comment.Id, [''], config.entityTypesNames.comment, skip)
        .then(response => {

          this.response(response);
          this.commentParentId = id;
          this.showReplysBool = true;
          this.replyBool = true;
          this.commentsProgresBar = false;
          this.expandedReplyContentClass = '-expanded';
          this.repliesArrowIconClass = '-arrowUp';
          this.changeDetectorRef.detectChanges();
        })
        .catch(errorRes => {
          let error = errorRes;
          this.commentsProgresBar = false;
          this.changeDetectorRef.detectChanges();
        })
    } else {
      this.expandedReplyContentClass = '-expanded';
      this.showReplysBool = true;
      this.repliesArrowIconClass = '-arrowUp';
    }

    if (this.comment.ChildCount === 1) {
      this.showHideComments = this.hideReply;
    } else {
      this.showHideComments = this.hideReplies;
    }

  }

  hideReplys(event) {
    this.showReplysBool = false;
    this.expandedReplyContentClass = '';
    this.repliesArrowIconClass = '';
    if (this.comment.ChildCount === 1) {
      this.showHideComments = this.showReply;
    } else {
      this.showHideComments = this.showReplies;
    }
  }

  response(response) {
    response.forEach((item, itemIndex) => {
      let viewComment: CommentViewModel = this._utilityService.mapJsonObjectToObject<CommentViewModel>(item);
      this.replies.push(viewComment);
    });
  }
//#endregion Show Hide Replies


  updateComment(inputValue) {
    if (inputValue !== this.comment.Content) {
      this.sendEditComment = true;
      let updatedComment = this.comment;
      updatedComment.Content = inputValue;
      this._commentService.updateComment(updatedComment)
        .then(response => {
          if (response) {
            this.comment = this._utilityService.mapJsonObjectToObject<CommentViewModel>(response);
          }
          this.isEditComment = false;
          this.sendEditComment = false;
          this.changeDetectorRef.detectChanges();
        })
        .catch(error => {
          this.errorResult(error);
          this.isEditComment = false;
          this.sendEditComment = false;
          this.changeDetectorRef.detectChanges();
        })
    } else {
      this.isEditComment = false;
      this.changeDetectorRef.detectChanges();
    }
  }

  onReplyButton() {

    this.isReplyInputOpen = true;
    setTimeout(() => {

      if (this.userAuthenticated) {

        super.onClickOnComment();
        this.changeDetectorRef.detectChanges();

      } else {
        this.redirectToLogin();
      }
    }, 0)

  }

  clickOnActionIcon() {
    if (this.userAuthenticated) {
      this.clickItemLikeTrigger = this.clickItemLikeTrigger ? false : true;
    } else {
      this._utilityService.redirectToLogin(this.itemId);
    }
  }

  onUserActionLike(actionIcon: ActionIconViewModel) {
    this.comment.UserLiked = actionIcon.userAction;
    this.comment.LikeCount = actionIcon.actionCount;
    this.updatedComment.emit(this.comment);
  }

  onUpdatedComment(reply: CommentViewModel) {
    let replyOrigin = this.replies.find(r => r.Id === reply.Id)
    if (replyOrigin) {
      replyOrigin = reply;
      this.updatedComments.emit(this.replies);
    }
  }

  onUpdatedComments(replies: CommentViewModel[]) {
    // this.comment.Replies = replies;
    this.updatedComment.emit(this.comment);
  }
}
