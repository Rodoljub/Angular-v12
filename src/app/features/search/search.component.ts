import { Component, OnInit, Input, Output, EventEmitter,
  PLATFORM_ID, Inject, ViewChild, ElementRef, HostListener, OnDestroy, Renderer2, ViewEncapsulation } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { EventService } from '../../services/utility/event.service';
import { FormControl } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { isPlatformBrowser } from '@angular/common';
import { debounceTime, tap, switchMap, filter, map, finalize } from 'rxjs/operators';
import { SearchApiService } from '../../services/rs/search-api.service';
import { config } from '../../../config/config';
import { Subscription, Observable } from 'rxjs';
import { snackBarConfig } from '../../../config/snackBarConfig';
import { UtilityService } from '../../services/utility/utility.service';
import { localStorageConfig } from '../../../config/localStorageConfig';
import { styleClassConfig } from '../../../config/styleClassConfig';
import { SearchService } from './search.service';
import { SnackBarService } from '../common/snack-bar/snack-bar.service';
import { SaveSearchResultModel } from './SaveSearchResultModel';
import { TagsModel } from '../items/item/item-tags/TagsModel';
import { Store } from '@ngrx/store';
import { AppState, selectCurrentSearchState, selectSavedSearchesState, selectSearchFormState } from '../../store/app.state';
import { MappingItem } from '../../shared/mappingItem';
import { errorsConfig } from '../../../config/errorsConfig';
import { configMessages } from '../../../config/configMessages';
import { AddSelectedTag, ChangeInputChars, ChangeSearch, ChangeSearchFormOpen,
   RemoveSearchForm, RemoveSelectedTag } from '../../store/actions/search-form.actions';
import { SearchFormModel } from './SearchFormModel';
import { CurrentSearchModel } from './CurrentSearchModel';
import { AddCurrentSearch } from '../../store/actions/current-search.actions';
import { TooltipPosition } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['search.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SearchComponent implements OnInit, OnDestroy {
  @Input() userAuthenticated: boolean;

  getSavedSearchesStateSub: Subscription;
  getSavedSearchesState: Observable<SaveSearchResultModel[]>;
  saveSearchResults: SaveSearchResultModel[] = [];

  getSearchFormStateSub: Subscription;
  getSearchFormState: Observable<SearchFormModel>;
  searchForm: SearchFormModel;

  getCurrentSearchStateSub: Subscription;
  getCurrentSearchState: Observable<CurrentSearchModel>;
  currentSearch: CurrentSearchModel;

  searchActive = false;
  saveSearchEnabled = false;

//#region Tags Models
  searchedTags: TagsModel[] = [];
  // selectedTags: string[] = [];
//#endregion Tags Models

  //#region Inputs
    isMobileView: boolean;
  //#endregion Inputs

  // #region Client View
  currentView = config.clientWidthTypes.small;
  smallView = config.clientWidthTypes.small;
  middelView = config.clientWidthTypes.middel;
  //#endregion Client View

  searchButtonAccentColor = '';
  searchButtonAccentBorderClass = '';
  searchButtonAccentColorClass = '';
  searchBorderAccentColorClass = '';
  searchButtonActiveClass = '';



  searchInputIsOpen = false;
  searchInputFullWidth = false;

  searchControl = new FormControl('');

  searchInputPlaceholder = config.inputPlaceholders.searchHere;
  searchHereInputPlaceholder = config.inputPlaceholders.searchHere;



// #region Outputs
  @Output() changeSearchInputState = new EventEmitter<boolean>();
  @Output() headerTranslateEnable = new EventEmitter<boolean>();
// #endregion Outputs

//#region View Child
  @ViewChild('searchInputElement', {static: false}) searchInputElement: ElementRef;
  @ViewChild(MatAutocompleteTrigger, {static: false}) autocomplete: MatAutocompleteTrigger;

//#endregion View Child


  isTagsList = false;

  searchTextSaved = '';

  separatorKeysCodes = [COMMA, ENTER];

  load = true;

// #region Style
  headerHeight: number;

  searchIconTooltipPosition: TooltipPosition = 'left';

  searchInputFocused: any;
  backRoute = '/';

//#endregion Style

  constructor(
    private store: Store<AppState>,
    private utilityService: UtilityService,
    private router: Router,
    private searchApiService: SearchApiService,
    private eventService: EventService,
    private renderer2: Renderer2,
    private snackBarService: SnackBarService,
    private searchService: SearchService,
    public snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.getSavedSearchesState = this.store.select(selectSavedSearchesState);
    this.getSearchFormState = this.store.select(selectSearchFormState);
    this.getCurrentSearchState = this.store.select(selectCurrentSearchState);
  }
//#region Resize
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    const resizeEventWidth = event.target.innerWidth;
    this.gridTileResize(resizeEventWidth);
  }

  gridTileResize(resizeEventWidth) {
    this.setHeaderHeight();
    this.currentView = this.searchService.setClientWidthType(resizeEventWidth);

    if (resizeEventWidth < 680) {
      this.searchBorderAccentColorClass = '';
      this.isMobileView = true;

    } else {
      this.isMobileView = false;
      this.showSearchForm();
    }
  }
//#endregion Resize

// #region Scroll
  @HostListener('window:scroll')
  onWindowScroll() {
    if (this.autocomplete.panelOpen) {
      this.autocomplete.closePanel();
    }

    if (this.isMobileView && this.searchInputIsOpen) {
      let temp = document.getElementById('header').getBoundingClientRect();
      if (temp.top === 0) {
        // this.autocomplete.openPanel();
      }
    }
  }
// #endregion Scroll


//#region get

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

get arrowBackShow() {
  if (this.currentView !== this.smallView) {
    if (!this.searchInputIsOpen) {
      return false;
    }
    return true;
  }
  return false;
}

get textareaShow() {
  if (isPlatformBrowser(this.platformId)) {
    if (this.currentView === this.smallView) {
      this.showSearchForm();
      this.hideSearchForm();
      return true;
    }
    return false;
  }
}

//#endregion get


//#region LifeCicle
  ngOnInit() {

    if (isPlatformBrowser(this.platformId)) {

      this.getSavedSearchesStateSub = this.getSavedSearchesState.subscribe((savedSearches) => {
        this.saveSearchResults = savedSearches;
      });

      this.getCurrentSearchStateSub = this.getCurrentSearchState.subscribe((currentSearch) => {
        this.currentSearch = currentSearch;
      })

      this.getSearchFormStateSub = this.getSearchFormState.subscribe((searchForm) => {


        if (!searchForm.searchFormOpen) {
          if (this.searchInputIsOpen) {
            this.closeSearch();
          }
        } else {
          if (!this.searchInputIsOpen) {
            this.openSearchInput();

            if (!!searchForm && searchForm.selectedTags.length === 0) {
              setTimeout(() => {
                this.searchInputElement.nativeElement.focus();
              }, 100)
            }
          }
        }

        if (this.searchInputElement && this.searchInputElement.nativeElement
          && this.searchInputElement.nativeElement.value !== searchForm.input) {
            this.searchControl.setValue(searchForm.input);
            // this.searchInputElement.nativeElement.value = searchForm.input;
          }
        // if (this.searchInputElement.nativeElement) this.searchInputElement.nativeElement.value

          if (!!searchForm && searchForm.selectedTags.length > 0) {
            if (!this.isTagsList) {
              this.isTagsList = true;
            }
          } else {
            if (this.isTagsList) {
              this.isTagsList = false;
            }
          }

          const searchActive = this.searchService.isSearchActive(searchForm, this.currentSearch);

          if (searchActive !== this.searchActive) {
            if (searchActive) {
              this.searchButtonAccentColorClass = styleClassConfig.accentBackgroundColor;
              this.searchButtonActiveClass = 'search-button-active';
              this.searchButtonAccentColor = 'accent';
              // this.searchButtonAccentBorderClass = styleClassConfig.accentBorder;
            } else {
              this.searchButtonAccentColorClass = '';
              this.searchButtonActiveClass = '';
              this.searchButtonAccentColor = '';
              // this.searchButtonAccentBorderClass = '';
            }

            this.searchActive = searchActive;
          }






          if (this.userAuthenticated) {
            if (searchForm.input && searchForm.input.trim() !== '' || searchForm.selectedTags.length > 0) {
              if (!this.saveSearchEnabled) {
                this.saveSearchEnabled = true;
              }
            } else {
              if (this.saveSearchEnabled) {
                this.saveSearchEnabled = false;
              }
            }
          }

          this.searchForm = searchForm;

          if (searchForm && searchForm.search) {
            this.doSearch();
          }
          this.setHeaderHeight();
      })

      // #region Resize
          const resizeEventWidth = document.scrollingElement.clientWidth;
          this.gridTileResize(resizeEventWidth);

          this.setHeaderHeight();
      //#endregion Resize


      //#region Clear Close Search on Router change Navigation

      this.router.events.subscribe((evt: ActivationEnd) => {
        console.log(evt);
        if (!(evt instanceof ActivationEnd)) {
          return;
        }
        const path = evt.snapshot.routeConfig.path;
        const pathFromRoute = evt.snapshot.pathFromRoot;
        // if (path !== 'search' &&  !evt.snapshot.pathFromRoot.find(o => o.outlet !== 'primary')) {
        //   if (localStorage.getItem(localStorageConfig.selectedTags)) {
        //     localStorage.removeItem(localStorageConfig.selectedTags)
        //   }
        // }

        if (
          (path === '')
           && (pathFromRoute
           && pathFromRoute.find(o => o.outlet !== 'primary') === undefined
           && !pathFromRoute.every(p => p.children.every(c => c.outlet !== 'primary'))
          ) ||
          path === 'user/:urlSegment' ||
          path === 'portfolio' ||
          path === 'favourites'
        ) {

            this.backRoute = this.router.url.split('(')[0];

          setTimeout(() => {
            this.showSearchForm();

          }, 100)
        }
      });
      //#endregion Clear Close Search on Router change Navigation

      this.initTags();

      this.load = false;
    }
  }

  ngOnDestroy() {
    if (this.getSavedSearchesStateSub) {
      this.getSavedSearchesStateSub.unsubscribe();
    }
    if (this.getCurrentSearchStateSub) {
      this.getCurrentSearchStateSub.unsubscribe();
    }
    if (this.getSearchFormStateSub) {
      this.getSearchFormStateSub.unsubscribe();
    }
  }
//#endregion LifeCicle


//#region Open Search Input

  dispatchSearchFormOpen() {
    this.store.dispatch(new ChangeSearchFormOpen(true))
  }

  private openSearchInput() {

    if (!this.searchInputIsOpen) {

      this.searchInputIsOpen = true;


      this.changeSearchInputState.emit(true);

      setTimeout(() => {
        // this.searchInputElement.nativeElement.focus();
        this.setHeaderHeight();
      }, 200)
    }
  }

//#endregion Open Search Input



// #region Search Filter Tags+

  private initTags() {
    this.searchTags();
    this.setFilteredTags();
  }

  private searchTags() {

    this.searchControl
      .valueChanges
      .pipe(
        debounceTime(300),
        tap(value => {
          this.store.dispatch(new ChangeInputChars(value))
        }),
        filter(value => value.trim() !== '' && this.searchForm.selectedTags.every(t => t !== value)),
        switchMap(value => this.searchApiService.searchTags(value, this.searchForm.selectedTags)
        .pipe(
          finalize(() => {
            // let temp =
          }),
        )))
      .subscribe(
        searchedTags => {
          if (searchedTags.length > 0) {
            this.searchedTags = searchedTags;
            if (this.searchInputFocused) {
              this.autocomplete.openPanel();
            }

          }
        },
        error => {
          this.errorResult(error)
          this.initTags();
        }
      );
  }

  errorResult(respError: any): any {
    let errorMapping: Array<MappingItem> = [
      new MappingItem(errorsConfig.search.ErrorSaveSearchTitleExist, configMessages.search.ErrorSaveSearchTitleExist),
      new MappingItem(errorsConfig.search.ErrorExistingSaveSearch, configMessages.search.ErrorExistingSaveSearch)
    ];
    // this.commonResponseService.dispalyErrorMessages(respError, this, errorMapping, 1);
    return respError
  }

  setFilteredTags() {

    this.searchControl.valueChanges
      .pipe(
        // debounceTime(300),
        // startWith(''),
        filter(value => value === null && value.trim() !== ''  && this.searchForm.selectedTags.every(t => t !== value)),
        // tap(() => this.searchInputPlaceholder = ''),
        tap(() => {
          if (this.searchInputFocused) {
            this.autocomplete.openPanel()
          }
        }),
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

  doSearch() {

    this.searchTextSaved = this.searchInputElement.nativeElement.value.trim();

    const isSearchActive = this.searchService.isSearchActive(
      this.searchForm, this.currentSearch
    );

    if (isSearchActive) {
        this.store.dispatch(new ChangeSearch(false));
        const currentSearch = new CurrentSearchModel(this.searchForm.input, this.searchForm.selectedTags);
        this.store.dispatch(new AddCurrentSearch(currentSearch));

        setTimeout(() => {
          this.router.navigate([{outlets: { a: null }}])
        }, 0)

        let searchQuery = this.searchService.setSearchQuery(this.searchForm);
        this.router.navigate(['search', { query: searchQuery }]);
        this.searchedTags = [];

        this.textareaBlur();

    }

    if (!this.searchInputIsOpen) {
      this.openSearchInput();
      // this.searchInputElement.nativeElement.value = '';
    }

    setTimeout(() => {
        // this.searchInputElement.nativeElement.value = this.searchTextSaved;
        this.searchTextSaved = '';
    }, 300)
  }

  clearSearch() {
    this.store.dispatch(new RemoveSearchForm());
    this.searchControl.setValue('');

  }

  closeSearch(event?) {
    if (event) {
      event.preventDefault();
    }

    this.clearSearch();
    this.textareaBlur();

    // this.currentSearch = new SaveSearchResultModel();
    const currentSearch = new CurrentSearchModel('', []);
    this.store.dispatch(new AddCurrentSearch(currentSearch));

    this.isTagsList = false;
    // this.focusSearchInput = true;

    this.router.navigate([this.backRoute]);

    // setTimeout(() => {
        this.searchInputIsOpen = false;
        this.changeSearchInputState.emit(false);
        this.setHeaderHeight();
    // }, 200)
  }



  saveSearch() {
    if (this.userAuthenticated) {
      this.searchService.openSaveSearchDialog();
    } else {
      this.utilityService.redirectToLogin('', '/');
    }
  }



// #region Tags Add Remove

trackTags(index, item) {
  return index
}

addTagFromInput(event): void {
  if (event.keyCode && event.keyCode === 13) {
    event.preventDefault();
  }

  if (event.keyCode === 13) {
    if ((event.currentTarget.value || '').trim()) {
      this.addTag(event.currentTarget.value.trim().toLowerCase());
      document.getElementsByName('searchInput')[0].focus();
    }
  }
}

addTag(tag: string) {
  // , $event.stopPropagation()
  if ((tag || '').trim()) {

    this.store.dispatch(new AddSelectedTag(tag));
    const autoTag = this.searchedTags.find(item => tag.toLowerCase() === item.name.toLowerCase());
    if (this.searchedTags.find(item => tag.toLowerCase() === item.name.toLowerCase())) {
      this.searchedTags.splice(this.searchedTags.indexOf(autoTag), 1)
    }

    this.store.dispatch(new ChangeInputChars(''));
    this.searchInputElement.nativeElement.value = '';
    // this.searchInputElement.nativeElement.focus();

  }

  setTimeout(() => {
    this.isTagsList = true;
  }, 300)
  this.setHeaderHeight();
}

removeTag(tag: any): void {
  // , $event.stopPropagation()
  let index = this.searchForm.selectedTags.indexOf(tag);

  if (index >= 0) {
    this.store.dispatch(new RemoveSelectedTag(tag));

    let tagAuto = new TagsModel('', tag)
    this.searchedTags.push(tagAuto);
  }

  if (this.searchForm.selectedTags.length === 0) {
    this.isTagsList = false;
    if (this.searchInputElement.nativeElement.value === '') {
      this.searchInputPlaceholder = this.searchHereInputPlaceholder;
    }
  }

  this.setHeaderHeight();

}
// #endregion Tags Add Remove


  private setHeaderHeight() {
    setTimeout(() => {
      const header = document.getElementById('header');
      if (header) {
        const headerHeight = header.clientHeight;
        if (this.headerHeight !== headerHeight) {
          this.headerHeight = headerHeight;
          this.eventService.setHeaderHeight(headerHeight);

          if (!this.isMobileView) {
            const searchEl = document.getElementById('search-mat-form-field');
            let infix = searchEl.children[0];
            if (infix.clientHeight > 80) {
              this.headerTranslateEnable.emit(true);
              // searchEl.scrollTop = infix.clientHeight;

              // let pane = document.getElementsByClassName('mat-autocomplete-search')[0];
              // this.renderer2.setStyle(pane.parentElement, 'top', this.headerHeight + 'px')
            } else {
              this.headerTranslateEnable.emit(false);
            }

          }
        }
      }

    }, 0)

  }

  showSearchForm() {
    let el = document.getElementById('search-form-input');
    if (el) {
      this.renderer2.removeStyle(el, 'display');
    }
  }

  hideSearchForm() {
    if (!this.searchInputIsOpen) {
      let el = document.getElementById('search-form-input');
      if (el) {
        this.renderer2.setStyle(el, 'display', 'none');
      }
    }
  }


// #region Textarea
  clickOnChipList() {
    this.searchInputElement.nativeElement.focus();
  }

  clickOnTextarea() {
      this.autocomplete.openPanel();
  }

  focusTextarea() {
    this.searchInputFocused = true;
    this.searchBorderAccentColorClass = styleClassConfig.accentBorder;

    if (!this.searchInputIsOpen) {
      // this.doSearch();
      // this.openSearchInput()
      this.dispatchSearchFormOpen();
    }
  }

  blurTextarea() {
    this.searchInputFocused = false;
    this.searchBorderAccentColorClass = '';
  }

  private textareaBlur() {
    document.getElementsByName('searchInput')[0].blur();
  }
// #endregion Textarea

}
