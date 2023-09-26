import { Injectable, EventEmitter } from '@angular/core';
import { CommentViewModel } from '../../features/comments/CommentViewModel';
import { MetaTagsModel } from '../../shared/MetaTagsModel';
import { ProgressSpinnerModel } from '../../features/common/progress-loaders/progress-spinner/ProgressSpinnerModel';
import { SnackBarModel } from '../../features/common/snack-bar/snack-bar-model';
import { DeleteEntitiesModel } from '../../features/models/DeleteEntitiesModel';
import { ItemViewModel } from '../../features/items/item/ItemViewModel';
import { SaveSearchResultModel } from '../../features/search/SaveSearchResultModel';
import { Observable , Subject, BehaviorSubject} from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class EventService {

  resetRecaptha = new EventEmitter<any>();
  executeRecaptcha = new EventEmitter<any>();
  onTagLoad = new EventEmitter<any>();
  onAddedTag = new EventEmitter<any>();
  onSelectedTag = new EventEmitter<string>();

  private itemEditMode = new Subject<ItemViewModel>();
  private updateItem = new Subject<ItemViewModel>();
  private deleteItemsAction = new Subject<DeleteEntitiesModel>();
  private headerHeight = new Subject<number>();
  private bottomMobileNavActionShow = new Subject<boolean>();

  private viewSection = new BehaviorSubject<boolean>(false);
  private reCaptchaState = new Subject<boolean>();
  private reCaptchaAction = new Subject<string>();
  private gRecaptchaResponse = new Subject<string>();
  private changeTheme = new Subject<string>();
  private replyParentId = new Subject<string>();
  private addReply = new Subject<CommentViewModel>();
  private mainProgressSpinner = new Subject<ProgressSpinnerModel>();
  private mainProgressBar = new Subject<boolean>();
  private snackBarModel = new Subject<SnackBarModel>();
  private reportedComment = new Subject<string>();
  private changeViewMode = new Subject<any>();
  private carouselItems = new Subject<ItemViewModel[]>();

  constructor() { }

// #region Item Edit Mode
  setItemEditMode(item: ItemViewModel) {
    this.itemEditMode.next(item);
  }

  getItemEditMode(): Observable<ItemViewModel> {
    return this.itemEditMode.asObservable();
  }
// #endregion Item Edit Mode

//#region Item Detail Mode

  setUpdateItemInList(item: ItemViewModel) {
    this.updateItem.next(item);
  }

  getUpdateItemInList(): Observable<ItemViewModel> {
    return this.updateItem.asObservable();
  }
//#endregion Item Detail Mode

//#region Delete Items

  setDeleteItemsAction(deleteItems: DeleteEntitiesModel) {
    this.deleteItemsAction.next(deleteItems);
  }

  getDeleteItemsAction(): Observable<DeleteEntitiesModel> {
    return this.deleteItemsAction.asObservable();
  }

//#endregion Delete Items

// #region Search

  setBottomMobileNavActionShowShow(visible: boolean) {
    this.bottomMobileNavActionShow.next(visible);
  }

  getBottomMobileNavActionShowShow(): Observable<boolean> {
    return this.bottomMobileNavActionShow.asObservable();
  }

//#endregion Search

// #region SetHeader HEighht
  setHeaderHeight(headerHeight: number) {
    this.headerHeight.next(headerHeight);
  }

  getHeaderHeight(): Observable<number> {
    return this.headerHeight.asObservable();
  }
// #endregion SetHeader HEighht

// #region View Section

  setViewSection(isView: boolean) {
    this.viewSection.next(isView);
  }

  getViewSection(): Observable<boolean> {
    this.getViewSectionBehavior();
    return this.viewSection.asObservable();
  }

  getViewSectionBehavior(): BehaviorSubject<boolean> {
    return new BehaviorSubject(this.viewSection.getValue())
  }

//#endregion View Section


// #region Main Progress Spinner

  setMainProgressSpinner(progressSpinerModel: ProgressSpinnerModel) {
    this.mainProgressSpinner.next(progressSpinerModel);
  }

  getMainProgressSpinner(): Observable<ProgressSpinnerModel> {
    return this.mainProgressSpinner.asObservable();
  }
// #endregion Main Progress Spinner

// #region ReCaptcha
  setReCaptchaState(state: boolean) {
    this.reCaptchaState.next(state);
  }

  getReCaptchaState(): Observable<boolean> {
    return this.reCaptchaState.asObservable();
  }

  setReCaptchaAction(action: string) {
    this.reCaptchaAction.next(action);
  }

  getReCaptchaAction(): Observable<string> {
    return this.reCaptchaAction.asObservable();
  }
  setgRecaptchaResponse(route: string) {
    this.gRecaptchaResponse.next(route);
  }

  getgRecaptchaResponse(): Observable<string> {
    return this.gRecaptchaResponse.asObservable();
  }
// #endregion ReCaptcha

// #region Change theme
  setTheme(title: string) {
    this.changeTheme.next(title);
  }

  getTheme(): Observable<string> {
    return this.changeTheme.asObservable();
  }
// #endregion Change theme


// #region Reply Parent Id
  setReplyParentId(parentId: string) {
    this.replyParentId.next(parentId);
  }

  getReplyParentId(): Observable<string> {
    return this.replyParentId.asObservable();
  }
// #endregion Reply Parent Id

// #region Add Reply
  setAddReply(reply: CommentViewModel) {
    this.addReply.next(reply);
  }

  getAddReply(): Observable<CommentViewModel> {
    return this.addReply.asObservable();
  }
// #endregion Add Reply

// #region Reported Comment
  setReportedComment(reportedCommentId: string) {
    this.reportedComment.next(reportedCommentId);
  }

  getReportedComment(): Observable<string> {
    return this.reportedComment.asObservable();
  }
// #endregion Reported Comment


// #region Main Progress Bar
  setMainProgressBar(progress: boolean) {
    this.mainProgressBar.next(progress);
  }

  getMainProgressBar(): Observable<boolean> {
    return this.mainProgressBar.asObservable();
  }
// #endregion Main Progress Bar

// #region Snack Bar Message
  setSnackBarMessage(snackBarModel: SnackBarModel) {
    this.snackBarModel.next(snackBarModel);
  }

  getSnackBarMessage(): Observable<SnackBarModel> {
    return this.snackBarModel.asObservable();
  }
// #endregion Snack Bar Message


// #region ListView Mode
  setItemListViewMode(viewMode: any) {
    this.changeViewMode.next(viewMode);
  }

  getItemListViewMode(): Observable<any> {
    return this.changeViewMode.asObservable();
  }
//#endregion ListView Mode

// #region Carousel
  setCarouselItems(items: ItemViewModel[]) {
    this.carouselItems.next(items);
  }

  getCarouselItems(): Observable<ItemViewModel[]> {
    return this.carouselItems.asObservable();
  }
//#endregion Carousel
}
