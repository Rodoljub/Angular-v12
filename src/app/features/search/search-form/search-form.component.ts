import { Component, OnInit, Input, ElementRef, ViewChild, Inject, PLATFORM_ID, Renderer2,
  EventEmitter, Output, HostListener, ChangeDetectorRef } from '@angular/core';
import { config } from '../../../../config/config';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { EventService } from '../../../services/utility/event.service';
import { localStorageConfig } from '../../../../config/localStorageConfig';
import { FormControl } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { debounceTime, tap, filter, switchMap, finalize, map } from 'rxjs/operators';
import { SearchApiService } from '../../../services/rs/search-api.service';
import { styleClassConfig } from '../../../../config/styleClassConfig';
import { SearchService } from '../search.service';
import { SaveSearchResultModel } from '../SaveSearchResultModel';
import { TagsModel } from '../../items/item/item-tags/TagsModel';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Component({
    selector: 'app-search-form',
    templateUrl: './search-form.component.html'
})
export class SearchFormComponent implements OnInit {

    @Input() currentView: string;
    @Input() saveSearchResults: SaveSearchResultModel[] = [];

    @Output() headerTranslateEnable = new EventEmitter<boolean>();

    @ViewChild('searchInputElement', {static: false}) searchInputElement: ElementRef;
    @ViewChild(MatAutocompleteTrigger, {static: false}) autocomplete: MatAutocompleteTrigger;

    searchControl = new FormControl();

    currentSearch: SaveSearchResultModel;

    isMobileView: boolean;

    searchButtonAccentColorClass = '';
    searchButtonAccentColor = '';
    searchBorderAccentColorClass = '';


    searchInputIsOpen = false;

    headerHeight: number;

    isSearchActive = false;

    isTagsList = false;
    selectedTags: string[] = [];
    searchedTags: TagsModel[] = [];

    searchInputPlaceholder = config.inputPlaceholders.searchHere;
    searchHereInputPlaceholder = config.inputPlaceholders.searchHere;

    separatorKeysCodes = [COMMA, ENTER];
    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private renderer2: Renderer2,
        private eventService: EventService,
        private searchService: SearchService,
        private searchApiService: SearchApiService,
        private changeDetectorRef: ChangeDetectorRef
    ) { }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
      const resizeEventWidth = event.target.innerWidth;
      this.setResize(resizeEventWidth);
    }

    setResize(resizeEventWidth: any) {
      this.setHeaderHeight();

      if (resizeEventWidth < 680) {
        this.searchBorderAccentColorClass = '';
        this.isMobileView = true;
      } else {
        this.isMobileView = false;
        // this.showSearchForm();
      }
    }

    @HostListener('window:scroll')
    onWindowScroll() {
      if (this.autocomplete.panelOpen) {
        this.autocomplete.closePanel();
      }

      if (this.isMobileView && this.searchInputIsOpen) {
        let temp = document.getElementById('header').getBoundingClientRect();
        if (temp.top === 0) {
          this.autocomplete.openPanel();
        }
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

    get textareaShow() {
        if (isPlatformBrowser(this.platformId)) {
          const smallView = config.clientWidthTypes.small;
          if (this.currentView === smallView) {
            // this.showSearchForm();
            // this.hideSearchForm();
            return true;
          }
          return false;
        }
    }

    ngOnInit(): void {
      if (isPlatformBrowser(this.platformId)) {
        this.setHeaderHeight();
        this.initTags();
      }
    }

    clickOnChipList() {
        this.searchInputElement.nativeElement.focus();
    }

    // #region Search Filter Tags

    private initTags() {
      this.searchApiTags();
      this.setFilteredTags();
    }

    private searchApiTags() {

      this.searchControl
        .valueChanges
        .pipe(
          debounceTime(300),
          // tap(() => this.setSearchActive()),
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
          // debounceTime(300),
          // startWith(''),
          filter(value => value.trim() !== ''  && this.selectedTags.every(t => t !== value)),
          // tap(() => this.searchInputPlaceholder = ''),
          tap(() => this.autocomplete.openPanel()),
          // filter(value => this.selectedTags.every(t => t !== value))
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
              this.selectedTags = [].concat(this.selectedTags);
              let autoTag = this.searchedTags.find(item => tag.toLowerCase() === item.name.toLowerCase());
              if (autoTag) {
                this.searchedTags.splice(this.searchedTags.indexOf(autoTag), 1)
              }

            // this.searchInputPlaceholder = '';
            this.searchInputElement.nativeElement.value = '';

            // this.setSearchActive();

            let tags: string[] = [];
            tags.push(tag);
            this.setSelectedTags(tags, true);

          }

          setTimeout(() => {
            this.isTagsList = true;
            document.getElementsByName('searchInput')[0].focus();
            this.changeDetectorRef.detectChanges();
          }, 50)
          this.setHeaderHeight();

    }

    removeTag(tag: any): void {
      // , $event.stopPropagation()
        let index = this.selectedTags.indexOf(tag);

        if (index >= 0) {
          this.selectedTags.splice(index, 1);
          this.selectedTags = [].concat(this.selectedTags);
          let tagAuto = new TagsModel('', tag)
          this.searchedTags.push(tagAuto);
        }

        if (this.selectedTags.length === 0) {
          this.isTagsList = false;
          if (this.searchInputElement.nativeElement.value === '') {
            this.searchInputPlaceholder = this.searchHereInputPlaceholder;
          }
        }

        let tags: string[] = [];
        tags.push(tag);
        this.setSelectedTags(tags, false);

        // this.setSearchActive();

        this.setHeaderHeight();

    }
    // #endregion Tags Add Remove

    private setSelectedTags(tags: string[], isSelected: boolean) {
        // let selectedTags = new SelectedTagsModel(tags, isSelected);
        // this.eventService.setSelectedTags(selectedTags);
        // localStorage.setItem(localStorageConfig.selectedTags, JSON.stringify(this.selectedTags))
    }

    private setSearchActive() {

        let isCurrentSearch = true
        // this.searchService.checkCurrentSearch(this.searchInputValue, this.selectedTags, this.currentSearch);

        if (!isCurrentSearch) {
          // this.eventService.setSearchActive(true);
          this.isSearchActive = true;
          this.searchButtonAccentColorClass = styleClassConfig.accentBackgroundColor;
          // this.searchButtonAccentBorderClass = styleClassConfig.accentBorder;
          this.searchButtonAccentColor = 'accent';
        } else {
          // this.eventService.setSearchActive(false);
          this.isSearchActive = false;
          this.searchButtonAccentColorClass = '';
          // this.searchButtonAccentBorderClass = '';
          this.searchButtonAccentColor = '';
        }
    }

    private setHeaderHeight() {
        setTimeout(() => {
          const headerEl = document.getElementById('header');
          if (headerEl) {
            const headerHeight = headerEl.clientHeight;
            if (this.headerHeight !== headerHeight) {
              this.headerHeight = headerHeight;
              this.eventService.setHeaderHeight(headerHeight);

              if (!this.isMobileView) {
                const searchEl = document.getElementById('search-mat-form-field');
                let infix = searchEl.children[0];
                if (infix.clientHeight > 80) {
                  this.headerTranslateEnable.emit(true);
                } else {
                  this.headerTranslateEnable.emit(false);
                }
              }
            }
          }


        }, 300)
    }

    // showSearchForm() {
    //   // if (this.searchInputIsOpen) {
    //     let el = document.getElementById('guest-search-form-input');
    //     this.renderer2.removeStyle(el, 'display');
    //   // }
    // }

    // hideSearchForm() {
    //   if (!this.searchInputIsOpen) {
    //     let el = document.getElementById('guest-search-form-input');
    //     this.renderer2.setStyle(el, 'display', 'none');
    //   }
    // }

    focusInput() {
        this.searchBorderAccentColorClass = styleClassConfig.accentBorder;
        const wideView = config.clientWidthTypes.wide;
        if (!this.searchInputIsOpen && this.currentView !== wideView) {
          // this.doSearch();
        }
    }

    blurInput() {
        this.searchBorderAccentColorClass = '';
    }

    // #region Textarea
    clickOnTextarea() {
    this.autocomplete.openPanel();
    }

    textareaOnBlur() {
    }
  // #endregion Textarea
}
