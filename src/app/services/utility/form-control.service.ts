import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { FormControlModel } from '../../shared/FormControlModel';
import { configMessages } from '../../../config/configMessages';
import { config } from '../../../config/config';

@Injectable({
  providedIn: 'root',
})
export class FormControlService {


    constructor() {}

    setTitleControl(titleControl: AbstractControl): FormControlModel {
        let titleControlModel = new FormControlModel();
        if (titleControl.errors
            && (titleControl.dirty || titleControl.touched || titleControl.pristine)) {
            if (titleControl.errors.required) {
              titleControlModel.errorMessage = configMessages.itemEdit.captionRequired;
            }
            if (titleControl.errors.minlength) {
                titleControlModel.errorMessage = configMessages.itemEdit.captionMinLength;
            }
            if (titleControl.errors.maxlength) {
                titleControlModel.errorMessage = configMessages.itemEdit.captionMaxLength;
            }

            if (titleControl.errors.existing) {
                titleControlModel.errorMessage = configMessages.itemEdit.titleExisting;
            }
          }

          if (titleControl.value.length === config.captionMaxCharacters) {
            titleControlModel.hintMessage = configMessages.itemEdit.captionHintMessage
          } else {
            titleControlModel.hintMessage = '';
          }

          return titleControlModel;
    }
}
