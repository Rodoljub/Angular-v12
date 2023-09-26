import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl, Validators } from '@angular/forms';
import { SaveSearchModel } from '../../../search/SaveSearchModel';
import { FormControlModel } from '../../../../shared/FormControlModel';
import { config } from '../../../../../config/config';
import { FormControlService } from '../../../../services/utility/form-control.service';
import { FormErrorStateMatcher } from '../../FormErrorStateMatcher';
import { SaveSearchResultModel } from '../../../../features/search/SaveSearchResultModel';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState, selectSavedSearchesState, selectSearchFormState } from '../../../../store/app.state';
import { SearchFormModel } from '../../../../features/search/SearchFormModel';

@Component({
    selector: 'app-save-search-dialog',
    templateUrl: './save-search-dialog.component.html'
})
export class SaveSearchDialogComponent implements OnInit, OnDestroy {

    saveSearchResult: SaveSearchResultModel;

    getSavedSearchesStateSub: Subscription;
    getSavedSearchesState: Observable<SaveSearchResultModel[]>;
    saveSearchResults: SaveSearchResultModel[];

    getSearchFormStateSub: Subscription;
    getSearchFormState: Observable<SearchFormModel>;
    searchForm: SearchFormModel;

    saveSearchTitle = config.labels.dialogMenu.saveSearch;
    saveSearchForm: FormGroup;
    titleControl: AbstractControl;
    @Output() cancelClick = new EventEmitter();
    @Output() actionClick = new EventEmitter<SaveSearchResultModel>();

    formControlModel: FormControlModel = new FormControlModel();

    formErrorStateMatcher = new FormErrorStateMatcher();

    constructor(
        private store: Store<AppState>,
        private formBuilder: FormBuilder,
        private formControlService: FormControlService
    ) {
        this.getSavedSearchesState = this.store.select(selectSavedSearchesState);
        this.getSearchFormState = this.store.select(selectSearchFormState);
        this.createForm();
     }

    ngOnInit(): void {


        this.getSearchFormStateSub = this.getSearchFormState.subscribe((searchForm) => {
            this.searchForm = searchForm;
        });

        this.getSavedSearchesStateSub = this.getSavedSearchesState.subscribe((savedSearches) => {
            this.saveSearchResults = savedSearches;

            if (this.saveSearchResults) {
                this.saveSearchResult = this.saveSearchResults.find(ssr => ssr.searchText ? null : '' === this.searchForm.input
                && ssr.searchTags.length === this.searchForm.selectedTags.length
                && ssr.searchTags.every(t => this.searchForm.selectedTags.indexOf(t) > -1)
              )

                if (this.saveSearchResult) {
                    this.saveSearchForm.get('titleControl').setValue(this.saveSearchResult.title)
                }
            }

        });


    }

    ngOnDestroy(): void {
        if (this.getSavedSearchesStateSub) {
            this.getSavedSearchesStateSub.unsubscribe();
        }
    }

    createForm() {
        this.saveSearchForm = this.formBuilder.group({
          'titleControl': [
               '',
                [
                    Validators.required,
                    // Validators.minLength(2),
                    Validators.maxLength(config.nameMaxCharacters)
                ]
            ]
        })
    }

    get formControls() {
        if (this.saveSearchForm) {
            this.titleControl = this.saveSearchForm.get('titleControl');

            // let existingTitle = this.saveSearchResults.find(r => r.title === this.titleControl.value &&
            //     r.title !== this.saveSearchResult.title);

            // if (existingTitle) {
            //     this.titleControl.setErrors({ 'existing': true})
            // } else {
            //     if (this.titleControl.errors) {
            //         if (this.titleControl.errors.existing) {
            //             this.titleControl.setErrors(null)
            //         }
            //     }
            // }

            let titleControlModel = new FormControlModel();
            if (this.titleControl.errors
                && (this.titleControl.dirty || this.titleControl.touched || this.titleControl.pristine)) {

                if (this.titleControl.errors.required) {
                  titleControlModel.errorMessage = config.nameRequired;
                }
                if (this.titleControl.errors.minlength) {
                    titleControlModel.errorMessage = config.nameMinLenght;
                }
                if (this.titleControl.errors.maxlength) {
                    titleControlModel.errorMessage = config.nameMaxLength;
                }

                if (this.titleControl.errors.existing) {
                    titleControlModel.errorMessage = config.nameExisting;
                }
              }

              if (this.titleControl.value && this.titleControl.value.length === config.nameMaxCharacters) {
                titleControlModel.hintMessage = config.nameHintMessage
              } else {
                titleControlModel.hintMessage = '';
              }

            // this.formControlModel = this.formControlService.setTitleControl(this.titleControl);
            this.formControlModel = titleControlModel;

            return this.titleControl;
        }
        return this.titleControl;
    }

    onClickCancel() {
        this.cancelClick.emit();
    }

    onClickAction() {
        if (this.saveSearchResult) {
            this.saveSearchResult.title = this.saveSearchForm.get('titleControl').value;
            this.actionClick.emit(this.saveSearchResult);
        } else {
            let ssrm = new SaveSearchResultModel();
            ssrm.searchText = this.searchForm.input;
            ssrm.searchTags = this.searchForm.selectedTags;
            ssrm.title = this.saveSearchForm.get('titleControl').value;

            this.actionClick.emit(ssrm);
        }
        // this.actionClick.emit(this.saveSearchForm.get('titleControl').value);
    }
}
