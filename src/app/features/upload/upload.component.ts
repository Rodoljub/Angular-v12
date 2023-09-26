import {
  Component, OnInit, ViewChild, Inject, AfterViewInit,
  ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy, PLATFORM_ID, HostListener, ElementRef, Input, Renderer2
} from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { CommonResponseService } from '../../services/utility/common-response.service';
import { EventService } from '../../services/utility/event.service';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { config } from '../../../config/config';
import { ItemService } from '../../services/rs/item.service';
import { UtilityService } from '../../services/utility/utility.service';
import { configMessages } from '../../../config/configMessages';
import { SnackBarService } from '../common/snack-bar/snack-bar.service';
import { ItemViewModel } from '../items/item/ItemViewModel';
import { MappingItem } from '../../shared/mappingItem';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { AddAnalyzingImage } from '../../features/upload/store/upload.actions';
import { AnalyzingImageModel } from './models/AnalyzingImageModel';
import { configErorrMessages } from '../../../config/configErorrMessages';
import { CreateItemModel } from './models/CreateItemModel';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() itemViewModel: ItemViewModel;

  file: File;
  imageUrl: string;

  fileSelected = false;
  accountProgressBarType = '';
  accountProgressBar = false;
  uploading = false;

  uploadCardInfo = '';


  isCardModalView: boolean;
  touchDevice: boolean;

  resetCanvas = false;

  videoAutoplay = false;
  @ViewChild('videoElement', {static: false}) videoElement: ElementRef;
  initialTitle: string;

  contentWrapFlexClass = '';
  appUpdateItemFormClass = '';
  updateItemFormAbsoluteClass = '';
  isCardFlex: boolean;

  cardTitle: string;
  uploadTitle = config.titles.upload;
  editTitle = config.titles.edit;
  desctiptionValue = '';
  commentsValue = false;



  public constructor(
    private store: Store<AppState>,
    private titleService: Title,
    private utilityService: UtilityService,
    private commonResponseService: CommonResponseService,
    private router: Router,
    private eventService: EventService,
    private itemService: ItemService,
    @Inject(DOCUMENT) private document: Document,
    private changeDetectorRef: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object,
    private renderer2: Renderer2,
    private snackBarService: SnackBarService
  ) { }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    const resizeEventWidth = event.target.innerWidth;
    const resizeEventHeight = event.target.innerHeight;
    this.resize(resizeEventWidth, resizeEventHeight);
  }

  resize(resizeEventWidth: number, resizeEventHeight: number) {
    this.setCard(resizeEventWidth, resizeEventHeight);
    this.setCardLayout(resizeEventWidth, resizeEventHeight);

    this.touchDevice = this.utilityService.isTouchDevice();
    this.setCardInfo();
  }

  setCardLayout(resizeEventWidth: number, resizeEventHeight: number) {
    if (resizeEventWidth >= 80 && resizeEventWidth <= 699) {
      this.isCardFlex = false;
      this.contentWrapFlexClass = '';
      this.appUpdateItemFormClass = '';
    } else {
      this.isCardFlex = true;
      this.contentWrapFlexClass = 'upload-content-wrap-flex';
      this.appUpdateItemFormClass = 'update-item-form-flex';
    }
  }

  setCard(resizeEventWidth: number, resizeEventHeight: number) {
    if (
      (resizeEventWidth >= 80 && resizeEventWidth <= 761)
      || (resizeEventHeight <= 400)
    ) {
      this.isCardModalView = false;
      this.accountProgressBarType = '';

    } else {
      this.isCardModalView = true;
      this.accountProgressBarType = config.progressBar.type.uploads;
    }
  }

  setCardInfo() {
    if (this.uploading) {
      this.uploadCardInfo = config.imageUploadingWait;
    } else {
      if (this.touchDevice) {
        this.uploadCardInfo = config.selectImage;
      } else {
        this.uploadCardInfo = config.selectOrDnDImage;
      }
    }
  }

  private setTitle(title: string) {
    this.initialTitle = this.titleService.getTitle();
    if (title === undefined) {
      title = config.titles.applicationTitle;
    }
    this.titleService.setTitle(title);
  }

//#region Lifecycles
  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {

      const resizeEventWidth = document.scrollingElement.clientWidth;
      const resizeEventHeight = document.scrollingElement.clientHeight;
      this.resize(resizeEventWidth, resizeEventHeight);


      if (this.itemViewModel) {
        this.setItemEditMode();
        this.setTitle(this.itemViewModel.Title)
      } else {
        this.cardTitle = this.uploadTitle;
        this.setTitle(config.titles.upload);
      }

    }
  }



  ngAfterViewInit() {

  }

  ngOnDestroy() {
    this.progressBar(false);
    this.titleService.setTitle(this.initialTitle);
  }
//#endregion Lifecycles

  onFileSelected(file) {
    this.fileSelected = true;
    this.file = file;
    let myReader: FileReader = new FileReader();
    myReader.readAsDataURL(file);

    // this.uploadImage(file);
  }

  setDescriptionValue(event) {
    this.desctiptionValue = event;
  }

  setCommentsValue(event) {
    this.commentsValue = event;
  }

  uploadImage(event) {
    if (!this.uploading) {
      // this.uploadCardInfo = config.imageUploadingWait;
      this.cardTitle = config.uploading;
      this.progressBar(true);
      this.uploading = true;

      let item = new CreateItemModel();
      item.Description = this.desctiptionValue;
      item.DisableComments = this.commentsValue;
      item.File = this.file;
      this.changeDetectorRef.detectChanges();

      this.itemService.createItem(item)
        .then(resp => {
          this.uploading = false;
          this.cardTitle = this.uploadTitle;
          this.progressBar(false);
          this.setCardInfo();
          this.onSetUploadCard();
          this.snackBarService.popMessageSuccess(configMessages.upload.imageUploaded);
          this.store.dispatch(
            new AddAnalyzingImage(new AnalyzingImageModel(resp.fileId, resp.fileExtension, resp.image))
          )
          this.changeDetectorRef.detectChanges();

        })
        .catch(respError => this.errorResult(respError));
    }

  }

  setItemEditMode() {

    this.cardTitle = this.editTitle;
    this.fileSelected = true;
    this.progressBar(false);
    this.imageUrl =  config.mediaImage + this.itemViewModel.ItemFilePath + config.jpegExtansion;

    this.changeDetectorRef.detectChanges();
  }

  errorResult(respError: any): any {
    this.uploading = false;

    this.fileSelected = false;
    this.accountProgressBar = false;

    if (respError && respError.error && respError.error.Key) {
      switch (respError.error.Key) {
        case 'ErrorImageFormat':
          this.snackBarService.popMessageError(configErorrMessages.upload.fileFormatInvalid);
          break;

        case 'ErrorFileIsEmpty':
          this.snackBarService.popMessageError(configErorrMessages.upload.fileIsEmpty);
          break;

        case 'ErrorFileIsTooLarge':
          this.snackBarService.popMessageError(`${configErorrMessages.upload.fileIsTooLarge} ${config.maxFileSizeMb}`);
          break;

        default:
          break;
      }
    }

    let errorMapping: Array<MappingItem> = [];
    // this.commonResponseService.dispalyErrorMessages(respError, this, errorMapping, 1);
    this.cardTitle = this.uploadTitle;
    this.setCardInfo();
    this.onSetUploadCard();

    // this.resetCanvas = this.resetCanvas ? false : true;
    this.changeDetectorRef.detectChanges();
    return respError;
  }

  private progressBar(progressBar: boolean) {
    this.accountProgressBar = progressBar;
  }

  closeUpload() {
    this.eventService.setItemEditMode(null);
  }

  onVideoAutoplay(event) {
    this.videoAutoplay = event;
  }

  onItemUpdating(event) {
    this.progressBar(event);
  }

  onSetUploadCard() {

    this.itemViewModel = undefined;
    this.fileSelected = false;
    this.imageUrl = undefined;
    this.resetCanvas = this.resetCanvas ? false : true;
    this.cardTitle = this.uploadTitle;
    this.setTitle(config.titles.upload);
  }

}
