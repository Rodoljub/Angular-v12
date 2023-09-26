import { Component, EventEmitter, Output, Input, ChangeDetectionStrategy } from '@angular/core';
import { EventService } from '../../../services/utility/event.service';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { MatDialogComponent } from '../../common/mat-dialog/mat-dialog.component';
import { ReportedContentService } from '../../../services/rs/reported-content.service';
import { CommonResponseService } from '../../../services/utility/common-response.service';
import { config } from '../../../../config/config';
import { UtilityService } from '../../../services/utility/utility.service';
import { environment } from '../../../../environments/environment';
import { ItemViewModel } from '../item/ItemViewModel';
import { UserProfileModel } from '../../accounts/models/UserProfileModel';
import { CommentViewModel } from '../../comments/CommentViewModel';
import { ReportedContentReasonModel } from '../../models/ReportedContentReasonModel';
import { SnackBarService } from '../../common/snack-bar/snack-bar.service';
import { DialogDataModel } from '../../common/mat-dialog/DialogDataModel';
import { MappingItem } from '../../../shared/mappingItem';
import { OidcService } from '../../accounts/services/oidc.service';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: '[app-base-item]',
  templateUrl: './base-item.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaseItemComponent {
  @Input() userAuthenticated: boolean;
  @Input() item: ItemViewModel;

  @Output() removeFavouritesItem = new EventEmitter<string>();
  @Output() deleteEntity = new EventEmitter<string>();
  // userImage: string;

  defaultProfilPic = config.defaultProfilePicture;
  actionIconUrl: '';

  focusCommentTrigger: boolean;

  itemCommentViewModel: CommentViewModel[] = [];

  userItemOwner = false;
  avatarCard = config.defaultProfilePicture;

  reportedEntityType: string;
  reportedContentReasons: ReportedContentReasonModel[] = [];
  reportedContentReasonsDescription: string[] = [];
  reportedEntityId = '';
  itemReportMenu = false;
  commentReportMenu = true;
  reportedTypeTitle: any;

  constructor(
    private oidcService: OidcService,
    private eventService: EventService,
    private router: Router,
    private matDialog: MatDialog,
    private reportedContentService: ReportedContentService,
    private commonResponseService: CommonResponseService,
    private utilityService: UtilityService,
    private snackBarService: SnackBarService,
  ) { }

  redirectToLogin(itemId) {
    // this.eventService.setLoginUser(null);
    let path = location.pathname.split('(')[0];
    let navigationExtras: NavigationExtras = {
      queryParams: { 'returnUrl': path, 'returnItemUrl': itemId }
    };
    let infoMessage = 'Please Login';
    // this.snackBarService.popMessageError(infoMessage);
    this.router.navigate([ {outlets: { auth: 'accounts/login'}}], navigationExtras);
  }

  setItem() {
    this.setComments();
    if (this.item.UserProfile.userEntityOwner) {
      this.userItemOwner = true;
    }
    if (this.item.UserProfile.userImagePath === '') {
      this.item.UserProfile.userImagePath = this.avatarCard;
    }
  }

  setComments() {
    if (this.item.Comment !== null) {
      // if (this.item.Comment.length > 0) {
      //   for (let com of this.item.Comment) {
          let com = this.utilityService.mapJsonObjectToObject<CommentViewModel>(this.item.Comment);
          this.itemCommentViewModel.push(com);
        // }
      // }
    }
  }

  onClickOnComment() {
    this.focusCommentTrigger = this.focusCommentTrigger ? false : true;
  }

  changeCommentCount(event) {
    this.item.CommentsCount = this.item.CommentsCount + event;
  }

  onUpdatedComments(comments: CommentViewModel[]) {

    this.item.Comment = comments[0];
  }

  getReportedContentReasons(reportedType: string) {

    if (this.reportedContentReasons.length < 1) {
      this.reportedContentService.getReportedContentReasons()
        .then(response => {
          for (let resons of response) {
            this.reportedContentReasons.push(
              new ReportedContentReasonModel(resons.id, resons.description, reportedType)
            )
          }
        })
        .catch(error => this.errorResult)
      }
  }

  openDialog(entityTypeName: string, entityId: string, entityOwner: boolean, itemId?: string, comment?: CommentViewModel) {
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

        let matDialogRef = this.matDialog.open(MatDialogComponent, {
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
              this.eventService.setItemEditMode(this.item);
              break;

            default:
              break;
          }
        })
      }
    } else {
      this.redirectToLogin(itemId)
    }


  }

  errorResult(respError: any): any {
    let errorMapping: Array<MappingItem> = [];
    // this.commonResponseService.dispalyErrorMessages(respError, this, errorMapping, 1);
    return respError
  }
}
