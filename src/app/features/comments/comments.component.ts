import { Component, OnInit, PLATFORM_ID, Inject,
  Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';
import { CommentsBaseComponent } from './comments-base/comments-base.component';
import { CommentViewModel } from './CommentViewModel';
import { EventService } from '../../services/utility/event.service';
import { CommentService } from '../../services/rs/comment.service';
import { UtilityService } from '../../services/utility/utility.service';
import { CommentModel } from './CommentModel';
import { isPlatformBrowser } from '../../../../node_modules/@angular/common';
import { ReportedContentService } from '../../services/rs/reported-content.service';
import { CommonResponseService } from '../../services/utility/common-response.service';
import { MappingItem } from '../../shared/mappingItem';
import { SnackBarService } from '../common/snack-bar/snack-bar.service';
import { OidcService } from '../accounts/services/oidc.service';
import { Store } from '@ngrx/store';
import { AppState, selectProfileState } from '../../store/app.state';
import { Observable } from 'rxjs';
import { ProfileDetailsModel } from '../profile-details/ProfileDetailsModel';
import { config } from '../../../config/config';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: '[app-comments]',
  templateUrl: './comments.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
  ]
})

export class CommentsComponent extends CommentsBaseComponent  implements OnInit, OnChanges {

  @Input() comments: CommentViewModel[] = [];
  @Input() commentsCount: number;
  getProfileState: Observable<ProfileDetailsModel>;
  userImagePath;
  defaultProfilPic: string = config.defaultProfilePicture;

  @Input() itemId: string;

  @Input() focusCommentTrigger: boolean;

  @Output() onChangeCommentCount = new EventEmitter();
  @Output() updatedComments = new EventEmitter<CommentViewModel[]>();


  addedComment: CommentViewModel;

  sendComment = false;

  _eventService: EventService;
  _oidcService: OidcService;
  _router: Router;
  _commentService: CommentService;
  _commonResponseService: CommonResponseService;
  _utilityService: UtilityService;
  _snackBarService: SnackBarService;


  constructor(
    private store: Store<AppState>,
    commentService: CommentService,
    eventService: EventService,
    formBuilder: FormBuilder,
    router: Router,
    utilityService: UtilityService,
    oidcService: OidcService,
    snackBarService: SnackBarService,
    @Inject(PLATFORM_ID) private platformId: Object,
    matDialog: MatDialog,
    reportedContentService: ReportedContentService,
    commonResponseService: CommonResponseService,
    private changeDetectorRef: ChangeDetectorRef
  ) {

    super( oidcService, eventService, router, matDialog,
      reportedContentService, commonResponseService,
      utilityService, snackBarService, formBuilder, commentService
    );

    this._oidcService = oidcService;
    this._eventService = eventService;
    this._router = router;
    this._commentService = commentService;
    this._commonResponseService = commonResponseService;
    this._utilityService = utilityService;
    this._snackBarService = snackBarService;

    this.getProfileState = this.store.select(selectProfileState);
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.getProfileState.subscribe((profile) => {
        if (profile && profile.imagePath !== null) {
          this.userImagePath = profile.imagePath;
        } else {
          this.userImagePath = this.defaultProfilPic;
        }
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  addComment(commentInputValue) {

      this.sendComment = true;
      let commentModel = new CommentModel(
        this.itemId,
        'Item',
        commentInputValue
      )

      this._commentService.addComment(commentModel)
          .then(response => {
            let comment = response
            if (comment.id !== undefined) {
              this.addedComment = this._utilityService.mapJsonObjectToObject<CommentViewModel>(comment);

              this.onChangeCommentCount.emit(+1);

              this.commentInputValue = '';
            } else {
              this._snackBarService.popMessageError('Something went wrong, try add comment again.');
              this.commentInputValue = commentInputValue;
            }
              this.sendComment = false
              this.changeDetectorRef.detectChanges();
          })
          .catch(respError => this.errorResult(respError));
  }

  errorResult(respError: any): any {
    let errorMapping: Array<MappingItem> = [];
    // this._commonResponseService.dispalyErrorMessages(respError, this, errorMapping, 1);
    this.sendComment = false;
    this.changeDetectorRef.detectChanges();
    return respError
  }

  changeCommentCount(event) {
    this.onChangeCommentCount.emit(event);
  }

  onUpdatedComments(comments: CommentViewModel[]) {
    this.comments = comments;
    this.updatedComments.emit(this.comments);
  }
}
