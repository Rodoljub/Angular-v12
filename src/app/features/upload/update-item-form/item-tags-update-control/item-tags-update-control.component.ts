import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { config } from '../../../../../config/config';
import { filter, map, tap } from 'rxjs/operators';
import { SnackBarService } from '../../../common/snack-bar/snack-bar.service';
import { MatChipList } from '@angular/material/chips';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { FloatLabelType } from '@angular/material/form-field';
const COMMA = 188;

@Component({
    selector: 'app-item-tags-update-control',
    templateUrl: 'item-tags-update-control.component.html',
    styleUrls: ['./item-tags-update-control.component.scss']
})

export class ItemTagsUpdateControlComponent implements OnInit, OnChanges {

    @Input() itemTags: string[] = [];
    @Input() isTagsDisabled = false;
    @Output() updatedItemTagsOut = new EventEmitter<string[]>();
    @ViewChild('tagTextareaElement', {static: true}) tagTextareaElement: ElementRef;
    @ViewChild('chipList', {static: true}) chipList: MatChipList;
    @ViewChild(MatAutocompleteTrigger, {static: true}) autocomplete: MatAutocompleteTrigger;

    removable = true;
    tagsForm: FormGroup;

    textareaControl = new FormControl();

    updatedItemTags: string[];
    removedTags: string[] = [];
    filteredTags: string[] = [];

    tagsLabel: FloatLabelType = 'always';
    floatLabelControl = new FormControl('always' as FloatLabelType);
    separatorKeysCodes = [COMMA];
    addOnBlur = true;

    tagsControlHintMessage = '';
    tagsMaximum = config.tags.maxTags;
    tagsMaxUserAdd = config.tags.maxUserAdd;
    minimumTags = config.tags.minTags;

    inputColor = 'accent';
    disabledTagClass = '';

    constructor(
      private renderer2: Renderer2,
      private snackBarService: SnackBarService,
      private formBuilder: FormBuilder
    ) { }

    
  get tagsControl() {
    let tagsControl = this.tagsForm.get('tagsControl');

    let textareaControlValue = 0;

    if (this.textareaControl.value) {
      textareaControlValue = this.textareaControl.value.trim().length;
    }

    if (this.updatedItemTags.length >= this.itemTags.length + this.tagsMaxUserAdd
      && this.updatedItemTags.length >= this.tagsMaximum ) {
        this.tagsControlHintMessage = config.tagTagsMax;
    } else {
      if (this.updatedItemTags.find(t => t === this.tagTextareaElement.nativeElement.value.toLowerCase())) {
        this.tagsControlHintMessage = config.tagAllreadyInList;
      } else {
        if (this.updatedItemTags.length < this.minimumTags) {
          if (textareaControlValue < config.tags.tagMinCharacters && textareaControlValue > 0) {
            this.tagsControlHintMessage = config.tagMinLenght
          } else {
            this.tagsControlHintMessage = config.tagsRequired;
          }
        } else {
          if (textareaControlValue < config.tags.tagMinCharacters && textareaControlValue > 0) {
            this.tagsControlHintMessage = config.tagMinLenght
          } else {
            this.tagsControlHintMessage = '';
          }
        }
      }
    }

    return tagsControl;
  }

  getFloatLabelValue(): FloatLabelType {
    return this.floatLabelControl.value || 'auto';
  }

  ngOnInit() {
    this.itemTags = this.itemTags.filter((n, i) => this.itemTags.indexOf(n) === i);
    this.createTagsForm();
    this.textareaControl = new FormControl();
    this.updatedItemTags = this.itemTags.map(i => i);
    this.updatedItemTagsOut.emit(this.updatedItemTags);
    this.setMaximumTags();
    this.setAutocomplete();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.isTagsDisabled !== undefined && !changes.isTagsDisabled.isFirstChange()) {
      if (changes.isTagsDisabled.currentValue !== changes.isTagsDisabled.previousValue) {
        if (changes.isTagsDisabled.currentValue) {
          this.disabledTagClass = 'disable'
          this.tagsControl.disable();
          this.inputColor = '';
          this.textareaControl.disable();
          const uploadTagsFormFieldEl = document.getElementById('upload-tags-form-field')
          const underlineEl = uploadTagsFormFieldEl.getElementsByClassName('mat-form-field-underline')[0];
          const labelEl = uploadTagsFormFieldEl.getElementsByClassName('mat-form-field-label')[0];
          this.renderer2.addClass(underlineEl, 'disable');
          this.renderer2.addClass(labelEl, 'disable');
          this.renderer2.addClass(this.tagTextareaElement.nativeElement, 'textarea-disable')
        } else {
          this.disabledTagClass = '';
          this.tagsControl.enable();
          this.inputColor = 'accent';
          this.textareaControl.enable();
          const uploadTagsFormFieldEl = document.getElementById('upload-tags-form-field')
          const underlineEl = uploadTagsFormFieldEl.getElementsByClassName('mat-form-field-underline')[0];
          const labelEl = uploadTagsFormFieldEl.getElementsByClassName('mat-form-field-label')[0];
          this.renderer2.removeClass(underlineEl, 'disable');
          this.renderer2.removeClass(labelEl, 'disable');
          this.renderer2.removeClass(this.tagTextareaElement.nativeElement, 'textarea-disable')
        }
      }
    }
  }

  trackTags(index) {
    return index;
  }

  setMaximumTags() {
    if (this.itemTags.length + this.tagsMaxUserAdd <= this.tagsMaximum) {
      this.tagsMaximum = this.itemTags.length + this.tagsMaxUserAdd;
    }
  }

  createTagsForm() {
    this.tagsForm = this.formBuilder.group({
      'textareaControl': [''],
      'tagsControl': ['']
    })
  }

  setAutocomplete() {
    this.textareaControl.valueChanges
    .pipe(
      // debounceTime(300),
      // startWith(''),
      // filter(value => value.trim() !== ''  && this.removedTags.every(t => t !== value)),
      // tap(() => this.searchInputPlaceholder = ''),
      tap(() => {
          this.autocomplete.openPanel();
      }),
      map(name => this.filterTags(name))
    )
    .subscribe(t => {
      this.filteredTags = t
    });

  }

  filterTags(val: string) {
    return val ? this.removedTags.filter(s => s.toLowerCase().indexOf(val.toLowerCase()) === 0)
      : this.removedTags;
  }

  clickOnChipList(event) {
    event.stopPropagation()
    if (!this.isTagsDisabled) {
      if (event) {
        event.preventDefault();
      }
      this.tagTextareaElement.nativeElement.focus();
      setTimeout(() => {
        let matForm = document.getElementById('upload-tags-form-field');
        if (matForm) {
          this.renderer2.addClass(matForm, 'mat-focused')
        }
      }, 0)
    }
  }

  blurTextarea() {
    let matForm = document.getElementById('upload-tags-form-field');
      if (matForm) {
        this.renderer2.removeClass(matForm, 'mat-focused')
      }
  }

  addTagFromInput(event): void {
    if (event) {
        event.preventDefault();
    }

    let value = event.currentTarget.value;
    if ((value || '').trim()) {
      this.addTag(value);
    }
  }

  addTag(tag: string) {
    // , $event.stopPropagation()
    if (this.updatedItemTags.length >= this.itemTags.length + this.tagsMaxUserAdd
        && this.updatedItemTags.length >= this.tagsMaximum) {

      // this.snackBarService.popMessageError('You have max number of tags');
    } else {

      if (tag.length >= config.tags.tagMinCharacters && config.tags.tagMaxCharacters >= tag.length) {

        if (!this.updatedItemTags.find(t => t === tag.toLowerCase())) {
          let index = this.removedTags.indexOf(tag);
          if (index >= 0) {
            this.removedTags.splice(index, 1);
          }

          this.updatedItemTags.push(tag);
          this.updatedItemTagsOut.emit(this.updatedItemTags);
          this.tagTextareaElement.nativeElement.value = '';
        } else {
          // this.snackBarService.popMessageError('Tag is already in list')
        }
      }

    }


  }

  remove(tag: any): void {
    //   if (!this.saveImageInfoUploading) {
    //     let index = this.tags.indexOf(tag);
    //   let isAnalyzeTag = this.tagsModel.find(item => tag === item.name);
    //   if (!isAnalyzeTag) {
    //     this.removeTags(index, tag);
    //   } else {

    //   let countAnalyzeTags = 0;
    //   for (let tagAnalyze of this.tags) {
    //        isAnalyzeTag = this.tagsModel.find(item => tag === item.name);
    //     if (isAnalyzeTag) {
    //       countAnalyzeTags = countAnalyzeTags += 1;
    //     }
    //   }
    //   if (this.tagsModel.length >= config.maxTags) {
    //     if (countAnalyzeTags <= config.tags.minTags) {
    //       this.snackBarService.popMessageError('You have min number of analyzing tags');
    //     } else {
    //       this.removeTags(index, tag);
    //     }
    //   }
    //   if (this.tagsModel.length < config.maxTags) {
    //     if (countAnalyzeTags <= this.tagsModel.length) {
    //       this.snackBarService.popMessageError('You have min number of analyzing tags');
    //     } else {
    //       this.removeTags(index, tag);
    //     }
    //   }
    // }
    //   }
  }

  removeTag(tag: any) {
    // , $event.stopPropagation()
    if (!this.isTagsDisabled) {
      let index = this.updatedItemTags.indexOf(tag);
      if (index >= 0) {
        if (this.updatedItemTags.length <= this.minimumTags) {
          this.tagsControlHintMessage = config.tagTagsMin;
          this.snackBarService.popMessageError('You have minimum tags');
        } else {
          this.updatedItemTags.splice(index, 1);
          this.removedTags.push(tag);
          this.updatedItemTagsOut.emit(this.updatedItemTags);
        }
      }
    }
  }
}
