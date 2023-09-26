import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { isPlatformBrowser } from '../../../../../node_modules/@angular/common';
import { environment } from '../../../../environments/environment.qa';
import { config } from '../../../../config/config';
import { DialogDataModel } from './DialogDataModel';
import { SaveSearchModel } from '../../search/SaveSearchModel';
import { Store } from '@ngrx/store';
import { AppState, selectSavedSearchesState } from '../../../store/app.state';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-mat-dialog',
  templateUrl: './mat-dialog.component.html',
  styles: []
})
export class MatDialogComponent implements OnInit {

  // isReportForm = false;

  dialogData: DialogDataModel;

  cancelLabel = config.labels.dialogMenu.cancel;

  dialogType: string;


  // initialDialogType = config.dialog.type.initial;
  entityDialogType = config.dialog.type.entity;
  reportDialogType = config.dialog.type.report;
  saveSearchDialogType = config.dialog.type.saveSearch;
  editCommentDialogType = config.dialog.type.comment;

  isInitialDialog = true;

  deleteOrReportLable: string;
  deleteOrReportTitle: string;

  isEdit = true;


  constructor(
    private store: Store<AppState>,
    public matDialogRef: MatDialogRef<MatDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.dialogData = data.dialogData;
    this.dialogType = data.dialogType;
   }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.setInitDialog();
    }
  }

  setInitDialog() {
    switch (this.dialogType) {
      case this.entityDialogType:
        this.setEntityDialog();
        break;

      default:
        break;
    }
  }

  setEntityDialog() {
    switch (this.dialogData.entityOwner) {
      case true:
        this.deleteOrReportLable = config.labels.dialogMenu.delete;
        break;
      case false:
        this.deleteOrReportLable = config.labels.dialogMenu.reportSpamOrAbuse;
        break;
      default:
        break;
    }

    if (this.dialogData.entityTypeName === config.entityTypesNames.comment) {
      this.isEdit = false;
    }
  }

  deleteOrReport() {
    switch (this.dialogData.entityOwner) {
      case true:
        this.deleteEntity();
        break;

      case false:
        this.reportEntity();
        break;

      default:
        break;
    }
  }

  reportEntity() {
    this.dialogType = this.reportDialogType;
  }

  deleteEntity() {
    this.matDialogRef.close(config.labels.dialogMenu.delete);
    // throw new Error('Method not implemented.');
  }

  editItem() {
    switch (this.dialogData.entityTypeName) {
      case config.entityTypesNames.item:
        this.matDialogRef.close(config.labels.dialogMenu.edit);
        break;

      case config.entityTypesNames.comment:
        this.matDialogRef.close(config.labels.dialogMenu.edit);
        break;

      default:
        break;
    }

  }

  saveSearch(event) {
    this.matDialogRef.close(event);
  }

  cancelClick(): void {
    this.matDialogRef.close();
  }

}
