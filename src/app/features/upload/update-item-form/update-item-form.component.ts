import { Component, OnInit, ChangeDetectionStrategy,
  ViewEncapsulation, Input, Output, EventEmitter, DoCheck,
  HostListener, ChangeDetectorRef, AfterViewInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { config } from '../../../../config/config';
import { ItemService } from '../../../services/rs/item.service';
import { configMessages } from '../../../../config/configMessages';
import { Router } from '@angular/router';
import { EventService } from '../../../services/utility/event.service';
import { CommonResponseService } from '../../../services/utility/common-response.service';
import { ItemViewModel } from '../../../features/items/item/ItemViewModel';
import { FormErrorStateMatcher } from '../../../features/common/FormErrorStateMatcher';
import { SnackBarService } from '../../../features/common/snack-bar/snack-bar.service';
import { TagsModel } from '../../../features/items/item/item-tags/TagsModel';
import { UploadItemModel } from '../models/UploadItemModel';
import { MappingItem } from '../../../shared/mappingItem';


@Component({
    selector: 'app-update-item-form',
    templateUrl: 'update-item-form.component.html',
    styleUrls: ['update-item-form.component.scss'],
    encapsulation: ViewEncapsulation.None,
    // changeDetection: ChangeDetectionStrategy.OnPush
})

export class UpdateItemFormComponent implements OnInit, DoCheck, AfterViewInit {

  @Input() itemViewModel: ItemViewModel;
  @Input() isCardFlex: boolean;

  @Output() itemUpdating = new EventEmitter<boolean>();
  @Output() setUploadCard = new EventEmitter();

  @ViewChild('formElement', {static: false}) formElement: ElementRef;

  uploadForm: FormGroup;
  captionValue = '';
  captionControlErrorMessage = '';
  titleHintMessage: string;

  isTagsDisabled = false;

  descriptionControlErrorMessage = '';
  descriptionHintMessage: string;

  captionMaxCharacters = config.captionMaxCharacters;


  stayOnPage = true;

  updatedItemTags: string[]

  tag: string;
  public tags: string[] = [];
  public tagsModel: TagsModel[] = [];
  autocompleteTags: string[] = [];


  saveImageInfoUploading = false;
  formErrorStateMatcher = new FormErrorStateMatcher();

  updateItemFormClass = '';

  updateItemFormAbsolutClass = 'update-item-form-absolute';
  updateItemFormRelativeClass = 'update-item-form-relative'
  childHeight: number;
  isTagsChanged: boolean;

  descriptionValue = '';
  isDescriptionChanged = false;
  itemDescription: string;

  commentsValue = true;
  isCommentsChanged = false;
  itemComents = true;


  constructor(
      private router: Router,
      private formBuilder: FormBuilder,
      private snackBarService: SnackBarService,
      private itemService: ItemService,
      private eventService: EventService,
      private commonResponseService: CommonResponseService,
      private changeDetectorRef: ChangeDetectorRef,
      private renderer2: Renderer2
  ) { }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    const resizeEventWidth = event.target.innerWidth;
    const resizeEventHeight = event.target.innerHeight;
    this.resize(resizeEventWidth, resizeEventHeight);
  }

  resize(resizeEventWidth: any, resizeEventHeight: any) {
    if (resizeEventWidth >= 80 && resizeEventWidth <= 699) {
      this.updateItemFormClass = '';
    } else {
      this.updateItemFormClass = this.updateItemFormAbsolutClass;
    }
  }

  ngDoCheck() {
    // if (this.formElement && this.formElement.nativeElement) {
    //   console.log('upload item form');
    // }
    if (this.isCardFlex) {
      const parentHeight = document.getElementById('app-update-item-form').clientHeight;
      const childHeight = document.getElementById('update-item-form').clientHeight;

      if (this.childHeight !== childHeight) {
        this.childHeight = childHeight;

        if (childHeight < parentHeight) {
          if (this.updateItemFormClass !== this.updateItemFormAbsolutClass) {
            this.updateItemFormClass = this.updateItemFormAbsolutClass;
          }
        } else {
          if (this.updateItemFormClass !== this.updateItemFormRelativeClass) {
            this.updateItemFormClass = this.updateItemFormRelativeClass;
          }
        }

      }
    }
  }

  ngOnInit() {
      this.createForm();
      const resizeEventWidth = document.scrollingElement.clientWidth;
      const resizeEventHeight = document.scrollingElement.clientHeight;
      this.resize(resizeEventWidth, resizeEventHeight);

      this.tags = this.itemViewModel.Tags;

      if (this.itemViewModel.Description === null) {
        this.itemDescription = '';
      } else {
        this.itemDescription = this.itemViewModel.Description;
      }

      this.itemComents = this.itemViewModel.DisableComments;
      
      this.descriptionValue = this.itemViewModel.Description;
      this.commentsValue = this.itemViewModel.DisableComments;
  }

  ngAfterViewInit() {
    // this.renderer2.listen()
  }

  createForm() {
    const i = this.itemViewModel.FileDetails.imageAnalysis;
      if (i && i.description && i.description.captions
        && i.description.captions.length > 0
        && i.description.captions[0].text
      ) {
        this.captionValue = i.description.captions[0].text;
      }
    this.uploadForm = this.formBuilder.group({
      'tagsControl': [
        '',
      ],
      // 'captionControl': [
      //   this.captionValue, [
      //     // Validators.minLength(config.captionMinCharacters),
      //     Validators.maxLength(config.captionMaxCharacters)
      //   ]
      // ],
      // 'descriptionControl': [
      //   '',
      //   [
      //     Validators.required,
      //     Validators.minLength(config.descriptionMinCharacters),
      //     Validators.maxLength(config.descriptionMaxCharacters)
      //   ]
      // ],
      'stayOnPageControl': [
        true
      ]
    })
  }

  // get captionControl() {
  //   let captionControl = this.uploadForm.get('captionControl');

  //   if (captionControl.errors
  //     && (captionControl.dirty || captionControl.touched || captionControl.pristine)) {
  //     if (captionControl.errors.required) {
  //       this.captionControlErrorMessage = configMessages.itemEdit.captionRequired;
  //     }
  //     if (captionControl.errors.minlength) {
  //       this.captionControlErrorMessage = configMessages.itemEdit.captionMinLength;
  //     }
  //     if (captionControl.errors.maxlength) {
  //       this.captionControlErrorMessage = configMessages.itemEdit.captionMaxLength;
  //     }
  //   }

  //   if (captionControl && captionControl.value && captionControl.value.length === config.captionMaxCharacters) {
  //     this.titleHintMessage = configMessages.itemEdit.captionHintMessage
  //   } else {
  //     this.titleHintMessage = '';
  //   }

  //   return captionControl;
  // }

  get isSubmitButtonDisabled() {

    if (this.saveImageInfoUploading) {
      return true;
    }

    const tagsConValLength = this.uploadForm.get('tagsControl').value.length;
    // const captionContVal = this.uploadForm.get('captionControl').value;

    let tagsValid = tagsConValLength >= config.tags.minTags || tagsConValLength <= config.tags.maxTags;

    // const isCaptionValid =  captionContVal.length <= config.captionMaxCharacters;

    // const isCaptionChanged = captionContVal !== this.captionValue;

    if (tagsValid  && 
      // isCaptionValid && 
      (
        // isCaptionChanged || 
        this.isTagsChanged || this.isDescriptionChanged || this.isCommentsChanged)) {
      return false;
    } else {
      return true;
    }
  }

  // get descriptionControl() {
  //   let descriptionControl = this.uploadForm.get('descriptionControl');

  //   if (descriptionControl.errors
  //     && (descriptionControl.dirty || descriptionControl.touched || descriptionControl.pristine)) {
  //     if (descriptionControl.errors.required === true) {
  //       this.descriptionControlErrorMessage = config.descriptionRequired
  //     }
  //     if (descriptionControl.errors.minlength) {
  //       this.descriptionControlErrorMessage = config.descriptionMinLenght
  //     }
  //     if (descriptionControl.errors.maxlength) {
  //       this.descriptionControlErrorMessage = config.descriptionMaxLenght
  //     }
  //   }

  //   if (descriptionControl.value.length === 250) {
  //     this.descriptionHintMessage = config.descriptionHintMessage
  //   } else {
  //     this.descriptionHintMessage = '';
  //   }

  //   return descriptionControl;
  // }

  resetInput() {
    this.uploadForm.patchValue({
      'tagsControl': '',
      // 'captionControl': '',
      // 'descriptionControl': '',
      'stayOnPageControl': true
    });

    // this.uploadForm.get('captionControl').enable();
    this.uploadForm.get('stayOnPageControl').enable();

    this.uploadForm.markAsUntouched();
    this.uploadForm.markAsPristine();
    this.tags = [];
  }

  saveImageInfo(event) {
    if (!this.saveImageInfoUploading) {
      // this.uploadCardInfo = 'Please wait'
      this.saveImageInfoUploading = true;
      this.itemUpdating.emit(true);
      this.setFormDisable();

      const uploadItem = this.setUploadItem();

      this.itemService.updateItem(uploadItem)
        .then(resp => {
          this.itemUpdating.emit(false);
          if (this.stayOnPage === false) {
            this.router.navigate(['portfolio']);
            this.eventService.setItemEditMode(null);
          } else {
            this.setUploadCard.emit();
            this.saveImageInfoUploading = false
          }

          this.snackBarService.popMessageSuccess('Your content is successfully saved');

        })
        .catch(respError => this.errorResult(respError));
    }
  }

  private setUploadItem(): UploadItemModel {
    let uploadItem = new UploadItemModel();
    // uploadItem.Title = this.uploadForm.get('captionControl').value;
    // uploadItem.Description = '';
    uploadItem.Description = this.descriptionValue;
    uploadItem.DisableComments = this.commentsValue;

    uploadItem.ItemId = this.itemViewModel.Id;

    let tagsMax = this.updatedItemTags.slice(0, config.tags.maxTags);

    for (let name of tagsMax) {
      uploadItem.Tags.push(name);
    }

    return uploadItem;
  }

  private setFormDisable() {
    // this.uploadForm.get('captionControl').disable();
    this.uploadForm.get('stayOnPageControl').disable();
    this.isTagsDisabled = true;
  }

  errorResult(respError: any): any {
    this.itemUpdating.emit(false);
    this.saveImageInfoUploading = false;
    let errorMapping: Array<MappingItem> = [];
    // this.commonResponseService.dispalyErrorMessages(respError, this, errorMapping, 1);
    this.setFormEnable();
    return respError;
  }

  setFormEnable() {
    // this.uploadForm.get('captionControl').enable();
    this.uploadForm.get('stayOnPageControl').enable();
    this.isTagsDisabled = false;
  }

  onUpdatedItemTags(updatedItemTags: string[]) {
    this.updatedItemTags = updatedItemTags.map(t => t);
    this.uploadForm.get('tagsControl').setValue(updatedItemTags);

    if (
      this.itemViewModel.Tags.length === this.updatedItemTags.length
        && this.updatedItemTags.every(ut => this.itemViewModel.Tags.indexOf(ut.toLowerCase()) > -1)
    ) {
        this.isTagsChanged = false;
    } else {

        this.isTagsChanged = true;
    }

  }

  setDescriptionValue(event) {
    this.descriptionValue = event;

    if (this.descriptionValue.trim() === this.itemDescription) {
      this.isDescriptionChanged = false;
    } else {
      this.isDescriptionChanged = true;
    }
  }

  setCommentsValue(event) {
    this.commentsValue = event;

    if (this.commentsValue === this.itemComents) {
      this.isCommentsChanged = false;
    } else {
      this.isCommentsChanged = true;
    }
  }
}
