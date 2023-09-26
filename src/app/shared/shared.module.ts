import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActionIconModule } from 'app-action-icon';
import { MessageCardComponent } from '../features/common/message-card/message-card.component';
import { MaterialModule } from '../shared/material/material.module';
import { ProgressBarComponent } from '../features/common/progress-loaders/progress-bar/progress-bar.component';
import { ProgressSpinnerComponent } from '../features/common/progress-loaders/progress-spinner/progress-spinner.component';
import { ResizeDirective } from '../directive/resize.directive';
import { ScrollDirective } from '../directive/scroll.directive';
import { HorizontalDragNDropDirective } from '../directive/horizontal-drag-n-drop.directive';
import { ItemComponent } from '../features/items/item/item.component';
import { ItemsListComponent } from '../features/items/items-list/items-list.component';
import { MenuNavigationComponent } from '../features/navigation/menu-navigation/menu-navigation.component';
import { ImagePreloaderDirective } from '../directive/image-preloader.directive';
import { DropFileDirective } from '../features/upload/drop-file.directive';
import { HoverDirective } from '../directive/hover.directive';
import { CounterDirective } from '../directive/counter.directive';
import { CommentsBaseComponent } from '../features/comments/comments-base/comments-base.component';
import { CommentsListComponent } from '../features/comments/comments-list/comments-list.component';
import { CommentComponent } from '../features/comments/comment/comment.component';
import { CommentsComponent } from '../features/comments/comments.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ItemTagsComponent } from '../features/items/item/item-tags/item-tags.component';
import { ItemActionsComponent } from '../features/items/item/item-actions/item-actions.component';
import { BaseItemComponent } from '../features/items/base-item/base-item.component';
import { DotsLoaderComponent } from '../features/common/progress-loaders/dots-loader/dots-loader.component';
import { SideNavContainerDirective } from '../directive/sidenav-container.directive';
import { BaseButtonIconImageComponent }
from '../features/common/buttons-icon-labels/base-button-icon-image/base-button-icon-image.component';
import { TagHoverDirective } from '../directive/tag-hover.directive';
import { ButtonMatFabIconComponent } from '../features/common/buttons-icon-labels/button-mat-fab-icon/button-mat-fab-icon.component';
import { SaveSearchDialogComponent } from '../features/common/mat-dialog/save-search-dialog/save-search-dialog.component';
import { MatDialogActionsComponent } from '../features/common/mat-dialog/mat-dialog-actions/mat-dialog-actions.component';
import { MatTagComponent } from '../features/items/item/item-tags/item-tag/item-tag.component';
import { SavedSearchesComponent } from '../features/search/saved-searches/saved-searches.component';
import { SavedSearchComponent } from '../features/search/saved-searches/saved-search/saved-search.component';
import { SavedSearchDirective } from '../features/search/saved-searches/saved-search/saved-search.directive';
import { FloatingMenuComponent } from '../features/navigation/floating-menu/floating-menu.component';
import { FloatingMenuButtonComponent } from '../features/navigation/floating-menu/floating-menu-button/floating-menu-button.component';
import { ItemsModalListComponent } from '../features/items/items-modal-list/items-modal-list.component';
import { NavigationLabelComponent } from '../features/common/buttons-icon-labels/navigation-label/navigation-label.component';
import { SearchMenuComponent } from '../features/search/search-menu/search-menu.component';
import { SearchFormComponent } from '../features/search/search-form/search-form.component';
import { IconLabelComponent } from '../features/common/buttons-icon-labels/icon-label/icon-label.component';
import { ModalMenuComponent } from '../features/navigation/modal-menu/modal-menu.component';
import { ItemsModalListDirective } from '../features/items/items-modal-list/items-modal-list.directive';
import { ItemModalComponent } from '../features/items/item/item-modal/item-modal.component';
import { ItemImageComponent } from '../features/items/item/item-image/item-image.component';
import { AccountsComponent } from '../features/accounts/accounts.component';
import { ProfileDetailsComponent } from '../features/profile-details/profile-details.component';
import {
  ProfileDetailsCountersComponent
} from '../features/profile-details/profile-details-counters/profile-details-counters.component';
import { CountLabelComponent } from '../features/common/buttons-icon-labels/count-label/count-label.component';
import { EditCommentDialogComponent } from '../features/common/mat-dialog/edit-comment-dialog/edit-comment-dialog.component';
import { CommentFormComponent } from '../features/comments/comment-form/comment-form.component';
import { UpdateItemFormComponent } from '../features/upload/update-item-form/update-item-form.component';
import { UploadSelectFilesComponent } from '../features/upload/upload-select-files/upload-select-files.component';
import { CanvasDirective } from '../features/upload/canvas.directive';
import { VideoDirective } from '../features/upload/video.directive';
import {
   ItemTagsUpdateControlComponent
 } from '../features/upload/update-item-form/item-tags-update-control/item-tags-update-control.component';
import { UpdateItemFormDirective } from '../features/upload/update-item-form/update-item-form.directive';
import { SocialNavLabelComponent } from '../features/common/buttons-icon-labels/social-nav-label/social-nav-label.component';
import { DividerOrComponent } from '../features/common/dividers/divider-or/divider-or.component';
import { DividerComponent } from '../features/common/dividers/divider/divider.component';
import { ImagesAnalyzingComponent } from '../features/common/images-analyzing/images-analyzing.component';
import { ImageAnalyzingComponent } from '../features/common/images-analyzing/image-analyzing/image-analyzing.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { DateFromNowPipe } from '../features/common/date-from-now.pipe';
import { SharingButtonsComponent } from '../features/common/share-buttons/sharing-buttons.component';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { DescriptionControlComponent } from '../features/upload/update-item-form/description-control/description-control.component';
import { ItemMediaComponent } from '../features/items/item/item-media/item-media.component';
import { CommentControlComponent } from '../features/upload/update-item-form/comment-control/comment-control.component';
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    ActionIconModule,
    ReactiveFormsModule,
    ImageCropperModule,
    ShareButtonsModule,
    ShareIconsModule
  ],
  declarations: [
    NavigationLabelComponent,
    DotsLoaderComponent,
    ProgressBarComponent,
    ProgressSpinnerComponent,
    ResizeDirective,
    ScrollDirective,
    HorizontalDragNDropDirective,
    ItemComponent,
    ItemModalComponent,
    ItemImageComponent,
    ItemTagsComponent,
    ItemActionsComponent,
    ItemsListComponent,
    ItemsModalListComponent,
    ItemMediaComponent,
    BaseItemComponent,
    BaseButtonIconImageComponent,
    ButtonMatFabIconComponent,
    MenuNavigationComponent,
    MessageCardComponent,
    ImagePreloaderDirective,
    DropFileDirective,
    CanvasDirective,
    VideoDirective,
    HoverDirective,
    TagHoverDirective,
    CounterDirective,
    CommentsComponent,
    CommentComponent,
    CommentsListComponent,
    CommentsBaseComponent,
    CommentFormComponent,
    SideNavContainerDirective,
    MatDialogActionsComponent,
    SaveSearchDialogComponent,
    EditCommentDialogComponent,
    MatTagComponent,
    SavedSearchesComponent,
    SavedSearchComponent,
    SearchFormComponent,
    SearchMenuComponent,
    SavedSearchDirective,
    FloatingMenuComponent,
    FloatingMenuButtonComponent,
    ModalMenuComponent,
    IconLabelComponent,
    CountLabelComponent,
    ItemsModalListDirective,
    ProfileDetailsComponent,
    ProfileDetailsCountersComponent,

    UpdateItemFormComponent,
    UpdateItemFormDirective,
    CommentControlComponent,
    DescriptionControlComponent,
    ItemTagsUpdateControlComponent,
    UploadSelectFilesComponent,
    ImagesAnalyzingComponent,
    ImageAnalyzingComponent,
    SocialNavLabelComponent,
    DividerComponent,
    DividerOrComponent,
    DateFromNowPipe,
    SharingButtonsComponent
  ],
  exports: [
    MaterialModule,
    ActionIconModule,
    ImageCropperModule,
    NavigationLabelComponent,
    DotsLoaderComponent,
    ProgressBarComponent,
    ProgressSpinnerComponent,
    ResizeDirective,
    ScrollDirective,
    HorizontalDragNDropDirective,
    ItemComponent,
    ItemModalComponent,
    ItemImageComponent,
    ItemTagsComponent,
    ItemActionsComponent,
    ItemsListComponent,
    ItemsModalListComponent,
    ItemMediaComponent,
    BaseItemComponent,
    ButtonMatFabIconComponent,
    BaseButtonIconImageComponent,
    MenuNavigationComponent,
    MessageCardComponent,
    ImagePreloaderDirective,
    DropFileDirective,
    CanvasDirective,
    VideoDirective,
    HoverDirective,
    TagHoverDirective,
    CounterDirective,
    CommentsComponent,
    CommentComponent,
    CommentsListComponent,
    CommentsBaseComponent,
    CommentFormComponent,
    SideNavContainerDirective,
    MatDialogActionsComponent,
    SaveSearchDialogComponent,
    EditCommentDialogComponent,
    MatTagComponent,
    SavedSearchesComponent,
    SavedSearchComponent,
    SearchFormComponent,
    SearchMenuComponent,
    SavedSearchDirective,
    FloatingMenuComponent,
    FloatingMenuButtonComponent,
    ModalMenuComponent,
    IconLabelComponent,
    CountLabelComponent,
    ItemsModalListDirective,
    ProfileDetailsComponent,
    ProfileDetailsCountersComponent,

    UpdateItemFormComponent,
    UpdateItemFormDirective,
    CommentControlComponent,
    DescriptionControlComponent,
    ItemTagsUpdateControlComponent,
    UploadSelectFilesComponent,
    ImagesAnalyzingComponent,
    ImageAnalyzingComponent,
    SocialNavLabelComponent,
    DividerComponent,
    DividerOrComponent,
    DateFromNowPipe,
    SharingButtonsComponent
  ],

})
export class SharedModule { }
