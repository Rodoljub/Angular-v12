import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef,
     EventEmitter, HostListener, Inject, Input, OnInit, Output, PLATFORM_ID, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TagsModel } from '../../../../features/items/item/item-tags/TagsModel';
import { SearchService } from '../../../../features/search/search.service';
import { SearchApiService } from '../../../../services/rs/search-api.service';
import { EventService } from '../../../../services/utility/event.service';
import { config } from '../../../../../config/config';
import { styleClassConfig } from '../../../../../config/styleClassConfig';
import { debounceTime, filter, finalize, map, switchMap, tap } from 'rxjs/operators';
import { GuestService } from '../../guest.service';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Component({
    selector: 'app-search-tags-form',
    templateUrl: 'search-tags-form.component.html',
    styleUrls: ['search-tags-form.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class SearchTagsFormComponent implements OnInit {

    @ViewChild('searchInputElement', {static: false}) searchInputElement: ElementRef;
    @ViewChild(MatAutocompleteTrigger, {static: false}) autocomplete: MatAutocompleteTrigger;
    @ViewChild('checkButtonElement', {static: false}) checkButtonElement: ElementRef;

    searchControl = new FormControl();

    isMobileView: boolean;
    isInterestsFocused = false;

    textareaTextAlignClass = 'text-align-center'

    searchButtonAccentColorClass = '';
    searchBorderAccentColorClass = '';

    isCheckButtonDisabled = true;

    isTagsList = false;
    selectedTags: string[] = [];
    searchedTags: TagsModel[] = [];

    searchInputPlaceholder = config.inputPlaceholders.addInterests;

    separatorKeysCodes = [COMMA, ENTER];

    // tagsHint = ['island', 'garden', 'flower', 'sunrise'];
    tagsHint = '(e.g., island, garden, flower, sunrise)';
    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private searchApiService: SearchApiService,
        private guestService: GuestService,
        private changeDetectorRef: ChangeDetectorRef
    ) { }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
      const resizeEventWidth = event.target.innerWidth;
      this.setResize(resizeEventWidth);
    }

    setResize(resizeEventWidth: any) {

      if (resizeEventWidth < 680) {
        this.isMobileView = true;
      } else {
        this.isMobileView = false;
      }
    }

    get searchInputValue() {
        if (
            this.searchInputElement
            && this.searchInputElement.nativeElement
            && this.searchInputElement.nativeElement.value
          ) {
            return this.searchInputElement.nativeElement.value;
        }

        return '';
    }

    ngOnInit(): void {
      if (isPlatformBrowser(this.platformId)) {
        this.initTags();
        const resizeEventWidth = document.scrollingElement.clientWidth;
        this.setResize(resizeEventWidth)
      }
    }

    // #region Search Filter Tags

    private initTags() {
      this.searchApiTags();
      this.setFilteredTags();
// this.searchedTags = [
//             new TagsModel('', this.tagsHint[0]),
//             new TagsModel('', this.tagsHint[1]),
//             new TagsModel('', this.tagsHint[2]),
//             new TagsModel('', this.tagsHint[3])
//         ]
    }

    private searchApiTags() {

      this.searchControl
        .valueChanges
        .pipe(
          debounceTime(300),
        //   tap(() => this.setSearchActive()),
          filter(value => value.trim() !== '' && this.selectedTags.every(t => t !== value)),
          switchMap(value => this.searchApiService.searchTags(value, this.selectedTags)
          .pipe(
            finalize(() => {
              // let temp =
            }),
          )))
        .subscribe(
          searchedTags => {
            if (searchedTags.length > 0) {
              this.searchedTags = searchedTags;
              this.autocomplete.openPanel();
            }
          },
          error => {
            // this.errorResult(error)
            this.initTags();
          }
        );
    }

    trackTags(index, item) {
      return index
    }

    setFilteredTags() {

      this.searchControl.valueChanges
        .pipe(
          filter(value => value.trim() !== ''  && this.selectedTags.every(t => t !== value)),
          tap(() => this.autocomplete.openPanel()),
          map(name => this.filterTags(name))
        )
        .subscribe(t => {
          this.searchedTags = t
        });
    }

    filterTags(val: string) {
      return val ? this.searchedTags.filter(s => s.name.toLowerCase().indexOf(val.toLowerCase()) === 0)
        : this.searchedTags;
    }

// #endregion Search Filter Tags

    // #region Tags Add Remove
    addTagFromInput(event): void {
          if (event.keyCode && event.keyCode === 13) {
            event.preventDefault();
          }

          let input = event.input;
          let value = event.value;

          if ((value || '').trim()) {
            this.addTag(value.trim().toLowerCase());
          }

          if (input) {
            input.value = '';
          } else {
            if (event.keyCode === 13) {
              if ((event.currentTarget.value || '').trim()) {
                this.addTag(event.currentTarget.value.trim().toLowerCase());
                this.searchInputElement.nativeElement.value = '';
                document.getElementsByName('searchInput')[0].focus();
              }
            }
          }
    }

    addTag(tag: string) {
      // , $event.stopPropagation()
          if ((tag || '').trim()) {

              this.selectedTags.push(tag.toLowerCase());
              // this.selectedTags = [].concat(this.selectedTags);
              let autoTag = this.searchedTags.find(item => tag.toLowerCase() === item.name.toLowerCase());
              if (autoTag) {
                this.searchedTags.splice(this.searchedTags.indexOf(autoTag), 1)
              }

            this.searchInputElement.nativeElement.value = '';

          }

          setTimeout(() => {
            this.isTagsList = true;
            document.getElementsByName('searchInput')[0].focus();
            this.changeDetectorRef.detectChanges();
          }, 0)

          this.checkInterestsValidation();
    }

    removeTag(tag: any): void {
        event.stopPropagation();
        let index = this.selectedTags.indexOf(tag);

        if (index >= 0) {
          this.selectedTags.splice(index, 1);
          // this.selectedTags = [].concat(this.selectedTags);
          let tagAuto = new TagsModel('', tag)
          this.searchedTags.push(tagAuto);
        }

        if (this.selectedTags.length === 0) {
          this.isTagsList = false;
        }

        this.checkInterestsValidation();

    }
    // #endregion Tags Add Remove

    checkInterestsValidation() {

      if (this.selectedTags.length > 2) {
        this.searchButtonAccentColorClass = styleClassConfig.accentBackgroundColor;
        this.isCheckButtonDisabled = false;
      } else {

        this.searchButtonAccentColorClass = '';
        this.isCheckButtonDisabled = true;
      }
    }

    storeInterests() {
      this.guestService.storeInterests(this.selectedTags);
    }


    focusInput() {
      if (this.isMobileView) {
        this.guestService.focusInterest();
        this.isInterestsFocused = true;
        this.textareaTextAlignClass = ''
      }

      this.searchBorderAccentColorClass = styleClassConfig.accentBorder;
    }

    blurInput() {
        this.searchBorderAccentColorClass = '';
    }

    blurInterests() {
      this.guestService.blurInterest();
      this.isInterestsFocused = false;
      this.textareaTextAlignClass = 'text-align-center';
      this.selectedTags = [];
    }

    // #region Textarea
    clickOnTextarea() {
    this.autocomplete.openPanel();
    }

    textareaOnBlur() {
    }
  // #endregion Textarea

  clickOnChipList() {
    this.searchInputElement.nativeElement.focus();
  }

}
