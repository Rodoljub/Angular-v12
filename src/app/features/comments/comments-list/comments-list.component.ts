import { Component, OnInit, Input,
  OnDestroy, SimpleChanges, OnChanges, PLATFORM_ID, Inject, Output,
  EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '../../../../../node_modules/@angular/router';
import { CommentsBaseComponent } from '../comments-base/comments-base.component';
import { CommentViewModel } from '../CommentViewModel';
import { EventService } from '../../../services/utility/event.service';
import { CommentService } from '../../../services/rs/comment.service';
import { UtilityService } from '../../../services/utility/utility.service';
import { isPlatformBrowser } from '../../../../../node_modules/@angular/common';
import { ReportedContentService } from '../../../services/rs/reported-content.service';
import { CommonResponseService } from '../../../services/utility/common-response.service';
import { config } from '../../../../config/config';
import { FormBuilder } from '@angular/forms';
import { UserProfileModel } from '../../accounts/models/UserProfileModel';
import { SnackBarService } from '../../common/snack-bar/snack-bar.service';
import { MappingItem } from '../../../shared/mappingItem';
import { OidcService } from '../../accounts/services/oidc.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: '[app-comments-list]',
  templateUrl: './comments-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
  ]
})
export class CommentsListComponent extends CommentsBaseComponent implements OnInit, OnDestroy, OnChanges {


  @Input() comments: CommentViewModel[] = [];
  @Input() commentsCount: number;
  @Input() addedComment: CommentViewModel;
  @Input() commentType: boolean;
  comment: CommentViewModel;
  initialCommentsIds: string[] = [];

  @Input() itemId: string;
  @Input() commentParentId: string;

  @Input() reply: CommentViewModel;
  @Input() replyBool: boolean;
  @Input() replysCount: number;

  @Input() commentsProgresBar = true;


  @Output() onChangeCommentCount = new EventEmitter();
  @Output() updatedComments = new EventEmitter<CommentViewModel[]>();

//#region Subscription
  parentIdSubscription: Subscription;
  addReplySubscription: Subscription;
  reportedCommentSubscription: Subscription;
//#endregion Subscription

 expandedReplyContentClass = '-expanded';


  showComment = config.showComment;
  showComments = config.showComments;
  showMoreComments = config.showMoreComments;
  hideComment = config.hideComment;
  hideComments = config.hideComments;


  replyInputbool = false;
  commentId: string;
  hasReplys = false;
  showReplysBool = false;
  addReplyBool: boolean;

//#region Services super
  _eventService: EventService;
  _commentService: CommentService;
  _commonResponseService: CommonResponseService;
  _utilityService: UtilityService;
//#endregion  Services super

//#region constructor
  constructor(
    eventService: EventService,
    commentService: CommentService,
    utilityService: UtilityService,
    oidcService: OidcService,
    router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    matDialog: MatDialog,
    reportedContentService: ReportedContentService,
    commonResponseService: CommonResponseService,
    formBuilder: FormBuilder,
    snackBarService: SnackBarService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    super( oidcService, eventService, router,
      matDialog, reportedContentService, commonResponseService,
      utilityService, snackBarService, formBuilder, commentService
    );
    this._eventService = eventService;
    this._commentService = commentService;
    this._commonResponseService = commonResponseService;
    this._utilityService = utilityService;
  }
//#endregion constructor

//#region LifeCycle
  ngOnInit() {

    if (isPlatformBrowser(this.platformId)) {

      this.comments.forEach(comment => {
        this.initialCommentsIds.push(comment.Id);
      });


      // this.getReportedContentReasons(config.entityTypesNames.comment);

      if (this.comments.length === this.commentsCount) {
        this.showHideComments = this.hideComments
      } else {
        this.showHideComments = this.showMoreComments;
      }

      this.commentsProgresBar = false;

      this.reportedCommentSubscription = this._eventService.getReportedComment()
        .subscribe(data => {
          let reportedComment = this.comments.find(item => item.Id === data)

          if (reportedComment !== undefined) {
            let index = this.comments.indexOf(reportedComment)
            if (index !== -1) {
              this.comments.splice(index, 1);
              this.commentsCount = this.commentsCount - 1
            }
          }
        })
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.reply) {
      if (changes.reply.currentValue !== null && changes.reply.currentValue !== changes.reply.previousValue
        && changes.reply.firstChange !== true) {
        this.comments.unshift(this.reply);
        this.reply = undefined;
        this.updatedComments.emit(this.comments);
        // this.replyInputbool = true;
      }
    }

    if (this.addedComment && changes.addedComment) {
      let addedCommChanges = changes.addedComment;
      if (addedCommChanges.currentValue !== undefined && addedCommChanges.previousValue !== addedCommChanges.currentValue) {
        this.comments.unshift(this.addedComment);
        this.updatedComments.emit(this.comments);
      }
    }
  }

  ngOnDestroy() {

    if (this.reportedCommentSubscription) {
      this.reportedCommentSubscription.unsubscribe();
    }
  }
//#endregion LifeCycle

  getComments() {
    if (this.commentsCount > 0 && this.comments.length < this.commentsCount) {
      this.commentsProgresBar = true;
      let skip = this.comments.length - this.initialCommentsIds.length;
      // let skip = this.comments.length;

      this._commentService.getComments(this.itemId, this.initialCommentsIds, config.entityTypesNames.item, skip)
        .then(response => {
          this.response(response);
          this.commentType = true;
          this.commentsProgresBar = false;
          // this._eventService.setCommentsProgressBar(false);

          if (this.comments.length === this.commentsCount) {
             this.showHideComments = this.hideComments;
          }
          this.changeDetectorRef.detectChanges();
        })
        .catch(respError => this.errorResult(respError))
    } else {
      if (this.commentsCount === 1) {
        this.showHideComments = this.hideComment;
      } else {
        this.showHideComments = this.hideComments;
      }

      this.expandedReplyContentClass = '-expanded';

      // this.changeDetectorRef.detectChanges();
    }
  }


  response(response) {
    response.forEach((item, itemIndex) => {
      let viewComment = this._utilityService.mapJsonObjectToObject<CommentViewModel>(item);
      this.comments.unshift(viewComment);
    });
  }

  hideAllComments() {
    this.expandedReplyContentClass = '';
    if (this.commentsCount === 1) {
      this.showHideComments = this.showComment;
    } else {
      this.showHideComments = this.showComments;
    }
  }

  errorResult(respError: any): any {
    let errorMapping: Array<MappingItem> = [];
    // this._commonResponseService.dispalyErrorMessages(respError, this, errorMapping, 1);
    this.commentsProgresBar = false;
    this.changeDetectorRef.detectChanges();
    return respError
  }

  onDeleteComment(commentId) {

    let id = commentId;

    this._commentService.deleteComment(id)
      .then(response => {
        if (response) {
          this.comments = this.comments.filter(comment => comment.Id !== commentId);
          this.initialCommentsIds = this.initialCommentsIds.filter(initialCommentsId => initialCommentsId !== commentId);
          this.onChangeCommentCount.emit(-1);

          if (this.replysCount > 0) {
            this.replysCount = this.replysCount - 1;
          }
        }
      })
      .catch(errorResp => {
        if (errorResp.status === 401) {
          this.redirectToLogin();
        }
        this._snackBarService.popMessageError(errorResp.Error[0])
      })
  }

  trackComment(index, comment) {
    return comment ? comment.id : undefined;
  }

  onUpdatedComment(comment: CommentViewModel) {
    let commentOrigin = this.comments.find(c => c.Id === comment.Id);
    if (commentOrigin) {
      commentOrigin = comment;
      this.updatedComments.emit(this.comments);
    }
  }
}
