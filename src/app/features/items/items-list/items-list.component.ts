import {
  Component, OnInit, Inject, HostListener, OnDestroy, ChangeDetectorRef,
  PLATFORM_ID,
  Renderer2,
  ViewChild,
  ElementRef,
  NgZone
} from '@angular/core';
import { Subscription, Subject, Observable } from 'rxjs';
import { Router, ActivatedRoute, Params, ParamMap, NavigationEnd, NavigationExtras } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FavouritesListDndService } from '../../../services/rs/favourites-list-dnd.service';
import { environment } from '../../../../environments/environment';
import { UtilityService } from '../../../services/utility/utility.service';
import { EventService } from '../../../services/utility/event.service';
import { CommonResponseService } from '../../../services/utility/common-response.service';
import { isPlatformBrowser, isPlatformServer } from '../../../../../node_modules/@angular/common';
import { ImagesService } from '../../../services/rs/images.service';
import { config } from '../../../../config/config';
import { ItemListService } from '../../../services/rs/item-list.service';
import { localStorageConfig } from '../../../../config/localStorageConfig';
import { snackBarConfig } from '../../../../config/snackBarConfig';
import { ItemComponent } from '../item/item.component';
import { SnackBarService } from '../../common/snack-bar/snack-bar.service';
import { ItemViewModel } from '../item/ItemViewModel';
import { GridColumnModel } from '../GridColumnModel';
import { ProgressSpinnerModel } from '../../common/progress-loaders/progress-spinner/ProgressSpinnerModel';
import { MappingItem } from '../../../shared/mappingItem';
import { ItemsModalListModel } from '../items-modal-list/ItemsModalListModel';
import { OidcService } from '../../accounts/services/oidc.service';
import { SaveSearchResultModel } from '../../../features/search/SaveSearchResultModel';
import { AppState, selectListViewModeState, selectSavedSearchesState } from '../../../store/app.state';
import { Store } from '@ngrx/store';
import { SearchService } from '../../../features/search/search.service';
import { AddSearchForm, AddSelectedTag, AddSelectedTags, ChangeSearchFormOpen } from '../../../store/actions/search-form.actions';
import { SearchFormModel } from '../../../features/search/SearchFormModel';
import { LocalStorageService } from '../../../services/utility/local-storage.service';


@Component({
  selector: 'app-items-list',
  templateUrl: './items-list.component.html',
  providers: [
  ]

})

export class ItemsListComponent implements OnInit, OnDestroy {

  getSavedSearchesState: Observable<SaveSearchResultModel[]>;
  saveSearchResults: SaveSearchResultModel[] = [];


  listViewModeStateSub: Subscription;
  getlistViewModeState: Observable<string>;
  listViewModeState: string;
  
  style
  //#region Items List variables
  userAuthenticated: boolean = undefined;
  //#region Route Params Config
  routeConfigPath: string;
  urlSegment: string = null;
  query: string;
  relatedItemId: string;
  //#endregion  Route Params Config

  //#region API Request Data
  typeOfItemsList: string;
  requestData: string;
  //#endregion API Request Data

  portfolioList = config.itemsListsTypes.portfolio;
  portfolioAnonymous = config.itemsListsTypes.portfolioAnonymous;

  //#region Items States
  loadingItems = false;
  totalItems = -2;
  itemLoad = true;
  getItems = true;
  //#endregion Items States

  //#region Items Collections
  items: ItemViewModel[] = [];
  originalItemsList: ItemViewModel[] = [];
  carouselItems: ItemViewModel[] = [];
  //#endregion Items Collections

  //#endregion Items List variables

  //#region Drag N Drop variable
  ItemsIndexChanges: ItemViewModel[] = [];
  itemIndexPickedUp: number;
  itemIndexHover: number;
  //#endregion Drag N Drop variable

  profileDetailsHidden = true;

  //#region Related Spinner
  relatedSpinner = false;
  relatedProgressSpinnercolor = 'accent';
  relatedSpinnerMode = 'indeterminate';
  //#endregion Related Spinner

  //#region Message
  labelList: string;
  noSearchResult = false;
  messageCard = false;
  messageTitle = '';
  messageContent = '';
  messageActionLable = '';
  messageCardActionRooute = '';
  //#endregion Message

  //#region Subscription
  itemPickedUpIdSubscription: Subscription;
  itemHoveredIdSubscription: Subscription;
  changeViewModeSubscription: Subscription;
  deleteItemsSubscription: Subscription;
  updateItemInListSubscription: Subscription;
  //#endregion Subscription

  //#region @ViewChild
  @ViewChild('itemListElement', {static: false}) itemListElement: ElementRef;
  @ViewChild('appItemElement', {static: false}) appItemElement: ItemComponent;
  @ViewChild('wallItemColumnElement', {static: false}) wallItemColumnElement: ElementRef;
  //#endregion @ViewChild

  //#region View Types

  gridViewType = config.listViewTypes.grid;
  wallViewType = config.listViewTypes.wall;
  carouselViewType = config.listViewTypes.carousel;

  currentViewType = config.listViewTypes.wall;

  appItemClass = '-wall';
  itemWallCardWidth: number;

  changingSize: Subject<boolean> = new Subject();

  detectUserAgentPlatformRegX = new RegExp(config.detectUserAgentPlatformRegX);

  //#endregion View Types

  //#region Grid List Variables
  clientWidth: number;
  clientHeight: number;

  maxGridWidth = config.gridListView.maxGridWidth;
  numberOfColumn = config.gridListView.numberOfColumn;

  gridColumnWidth = config.imageWidth.list;

  gridColumns: GridColumnModel[] = [];
  gridColumnXTranslate = 0;

  itemImageWidth = config.imageWidth.itemList;
  itemImageListWidth = config.imageWidth.itemList;
  itemImageViewGridWidth = config.imageWidth.itemViewMode;

  itemCardPadding = config.itemCard.padding;

  gridListColumnWidth = config.imageWidth.list;
  gridViewGridColumnWidth = config.imageWidth.viewMode;

  itemTranslateX
  itemTranslateY
  itemListTimeout: NodeJS.Timer;
  deleteItemsIds: string[];
  getSavedSearchesStateSub: Subscription;
  loginChangedSub: Subscription;

  //#endregion Grid List Variables

  // itemListTimeout: NodeJS.Timer;


  //#region Constructor
  constructor(
    private store: Store<AppState>,
    private searchService: SearchService,
    private router: Router,
    private route: ActivatedRoute,
    private zone: NgZone,
    private itemsListService: ItemListService,
    private utilityService: UtilityService,
    private titleService: Title,
    private eventService: EventService,
    private snackBarService: SnackBarService,
    private changeDetectorRef: ChangeDetectorRef,
    private commonResponseService: CommonResponseService,
    private favouritesListDndService: FavouritesListDndService,
    private imagesService: ImagesService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private rendere2: Renderer2,
    private oidcService: OidcService,
    private localStorageService: LocalStorageService,

  ) {
    // unsubscirbe
     this.loginChangedSub = this.oidcService.loginChanged.subscribe(userAuthenticated => {
        this.userAuthenticated = userAuthenticated;
    })

    this.getSavedSearchesState = this.store.select(selectSavedSearchesState);
    this.getlistViewModeState = this.store.select(selectListViewModeState);


    if (isPlatformBrowser(this.platformId)) {

    this.getSavedSearchesStateSub = this.getSavedSearchesState.subscribe((savedSearches) => {
      this.saveSearchResults = savedSearches;

      if (this.routeConfigPath === config.routeConfigPath.home) {
        this.getHomeItems();
      }
    });
  }

  }
  //#endregion constructor


  //#region Host Listeners
  @HostListener('window:scroll', ['$event'])
  onWindowScroll($event) {

    let scrollHeight = document.body.scrollHeight;
    if ((window.innerHeight + window.scrollY) >= scrollHeight - Math.round((scrollHeight / 100) * 20) &&
      !this.loadingItems &&
      this.items.length !== 0
    ) {
      this.loadingItems = true;
      this.getItems = this.getItems ? false : true;
      this.getPagedItems(this.items.length);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (isPlatformBrowser(this.platformId)) {
      const docClientRect = document.scrollingElement.getBoundingClientRect();
      let clientWidth = docClientRect.width;
    // let clientWidth = document.scrollingElement.clientWidth;
    if (this.clientWidth !== clientWidth) {
      this.clientWidth = clientWidth;
      this.setListView();
      this.changingSize.next(true);
    }
  }
  }

  //#endregion Host Listeners

  //#region LifeCycle
  ngOnInit() {

    if (isPlatformBrowser(this.platformId)) {

      setTimeout(() => {

      window.onbeforeunload = function () {
        window.scrollTo(0, 0);
      }



      this.updateItemInListSubscription = this.eventService.getUpdateItemInList()
        .subscribe(item => {
          let itemOriginal = this.items.find(it => it.Id === item.Id )

          if (itemOriginal) {
            itemOriginal = item;
            this.originalItemsList = this.items.map(i => i);
          }
        })

        this.userSubscription();


      this.route.params.subscribe(params => {
        window.scrollTo(0, 0);
        // document.documentElement.scrollTo(0, 0);
        this.query = undefined;
        this.totalItems = -2
        this.items = [];
        this.originalItemsList = [];
        this.noSearchResult = false;
        this.messageCard = false;
        this.profileDetailsHidden = true;
        if (!this.clientWidth) {
          this.rendere2.setStyle(document.body, 'overflow-y', 'scroll');
          const docClientRect = document.scrollingElement.getBoundingClientRect();
          this.clientWidth = docClientRect.width;
          // this.clientWidth = document.scrollingElement.clientWidth;
          this.rendere2.removeStyle(document.body, 'overflow-y')
        }

        this.setListView();
        this.getItems = true;



        this.urlSegment = params['urlSegment'] as string;
        this.query = params['query'] as string;
        this.relatedItemId = params['id'] as string;

        if (this.query !== undefined) {
          if (this.query.trim() === '') {
            this.query = undefined;
          }
        }

        this.getPagedItemsByParams();

        this.routeConfigPath = this.route.routeConfig.path;

        this.getPagedItemsByPath();

        if (
          this.urlSegment === undefined
          && this.relatedItemId === undefined
          && this.routeConfigPath !== config.routeConfigPath.home
          && this.routeConfigPath !== config.routeConfigPath.portfolio
          && this.routeConfigPath !== config.routeConfigPath.favourites
          && this.query === undefined
        ) {
          this.router.navigate(['/'])
        }

        // setTimeout(() => {
          let progressSpinnerModel = new ProgressSpinnerModel(true, false);
          this.eventService.setMainProgressSpinner(progressSpinnerModel);
        // }, 10)


        // this.changeDetectorRef.detectChanges();
      })

      this.dragAndDropSubscriptions();

      this.deleteItemSubscription();

      this.changeViewSubscription();

    })

    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      let progressSpinnerModel = new ProgressSpinnerModel(false, false);
      this.eventService.setMainProgressSpinner(progressSpinnerModel);

      this.eventService.setViewSection(false);

      if (this.loginChangedSub) {
        this.loginChangedSub.unsubscribe();
      }

      if (this.getSavedSearchesStateSub) {
        this.getSavedSearchesStateSub.unsubscribe();
      }

      if (this.itemPickedUpIdSubscription) {
        this.itemPickedUpIdSubscription.unsubscribe();
      }
      if (this.itemHoveredIdSubscription) {
        this.itemHoveredIdSubscription.unsubscribe();
      }
      if (this.changeViewModeSubscription) {
        this.changeViewModeSubscription.unsubscribe();
      }

      if (this.deleteItemsSubscription) {
        this.deleteItemsSubscription.unsubscribe();
      }

      if (this.updateItemInListSubscription) {
        this.updateItemInListSubscription.unsubscribe();
      }

      this.calculateItemsPlaceChanged();
      this.messageCard = false;
    }
  }
  //#endregion LifeCycle

  //#region Set Get ItemsList

  private getPagedItemsByPath() {
    switch (this.routeConfigPath) {

      case config.routeConfigPath.home:
        this.typeOfItemsList = config.itemsListsTypes.latest;
        this.getPagedItems(0);
        // this.titleService.setTitle(config.titles.home);

      //   this.typeOfItemsList = config.itemsListsTypes.search
      //   this.oidcService.isAuthenticated().then(userAuthenticated => {

      //     this.userAuthenticated = userAuthenticated;

      //     if (this.userAuthenticated) {
      //       this.getHomeItems();
      //     } else {

      //       const guest = this.localStorageService.get('guest');

      //         if (!guest) {
      //           this.router.navigate(['guest']);
      //         } else {
      //           // const savedSearch = guest
      //           const searchForm = new SearchFormModel(true, '', guest, false);
      //           // this.store.dispatch(new AddSearchForm(searchForm));

      //           let searchQuery = this.searchService.setSearchQuery(searchForm);
      //           this.requestData = searchQuery;
      //           this.getPagedItems(0);
      //           this.titleService.setTitle(config.titles.applicationTitle);
      //         }
      //     }



      // })

        break;

      case config.routeConfigPath.portfolio:
        this.typeOfItemsList = this.portfolioList;
        this.getPagedItems(0);
        this.titleService.setTitle(
          // this.authGuard.getUserData().Name + 
          // config.titles.titleSeparator +
          config.titles.portfolioTitle +
          config.titles.titleSeparator +
          config.titles.applicationTitle);
        break;

      case config.routeConfigPath.favourites:
        this.typeOfItemsList = config.itemsListsTypes.favourites;
        this.getPagedItems(0);

        this.titleService.setTitle(
          // this.authGuard.getUserData().Name
          // + config.titles.titleSeparator
          // +
          config.titles.favouritesTitle
          + config.titles.titleSeparator
          + config.titles.applicationTitle
        );
        break;

      default:
        break;
    }
  }

  private getHomeItems() {
    if (this.saveSearchResults && this.saveSearchResults.length > 0) {
      const savedSearch = this.saveSearchResults[0];

      const searchForm = new SearchFormModel(
        true, savedSearch.searchText, savedSearch.searchTags, false
      );
      // this.store.dispatch(new AddSearchForm(searchForm));
      let searchQuery = this.searchService.setSearchQuery(searchForm);

      this.requestData = searchQuery;
      this.getPagedItems(0);
      this.titleService.setTitle(config.titles.applicationTitle);
    } else {
      let guest = this.localStorageService.get('guest');
      if (guest) {
        const searchForm = new SearchFormModel(
          true, '', guest, false
        );

        let searchQuery = this.searchService.setSearchQuery(searchForm);

        this.requestData = searchQuery;
        this.getPagedItems(0);
        this.titleService.setTitle(config.titles.applicationTitle);
        // this.store.dispatch(new AddSelectedTags(guest));
      } else {
        this.store.dispatch(new ChangeSearchFormOpen(true));
      }
      this.setHomeInstructionMessage();
    }
  }

  private getPagedItemsByParams() {
    if (this.urlSegment) {
      this.typeOfItemsList = this.portfolioAnonymous;
      this.requestData = this.urlSegment;
      this.getPagedItems(0);
      this.titleService.setTitle(this.urlSegment + config.titles.titleSeparator + config.titles.applicationTitle);
    }
    if (this.query) {
      this.typeOfItemsList = config.itemsListsTypes.search;
      this.requestData = this.query;

      this.searchService.searchQueryChanged(this.query)
      this.getPagedItems(0);
      this.titleService.setTitle(this.query + config.titles.titleSeparator + config.titles.applicationTitle);
    }
    if (this.relatedItemId) {
      this.typeOfItemsList = config.itemsListsTypes.related;
      this.requestData = this.relatedItemId;
      this.getPagedItems(0);
    }
  }

  getPagedItems(skip: number) {

    if (this.totalItems === -2 || this.totalItems > this.items.length) {

      if (this.relatedItemId) {
        this.relatedSpinner = true;
      } else {
        if (this.items.length !== 0) {
          this.relatedSpinner = true;
        }
      }

      this.getListItems(skip)
    }
  }

  getListItems(skip: number) {
    this.loadingItems = true;

    this.zone.runOutsideAngular(() => {
      this.itemsListService.getItemsList(this.typeOfItemsList, skip, this.requestData)
      .then(response => {
        if (response.length > 0) {
          this.response(response);
        } else {
          this.setEmptyItemsList();
          // this.eventService.setViewSection(false);
        }
        this.loadingItemBar();
      })
      .catch(respError => this.errorResult(respError))
      // this.changeDetectorRef.detectChanges();
    })
    

    // this.itemListTimeout = setTimeout(() => {
    //   this.itemsListService
    //     .getInMemoryItems(skip)
    //     .then(response => {
    //       // if (response.length > 0) {
    //         this.response(response);
    //       // } else {
    //       //   this.setEmptyItemsList()
    //       // }
    //       this.loadingItemBar();
    //     })
    //     .catch(respError => {
    //       this.errorResult(respError)
    //     })
    // }, 200)




  }

  //#endregion Set Get ItemsList


  //#region API response
  response(response) {
    response.forEach((item: any, itemIndex: number) => {

      let viewItem: ItemViewModel = this.utilityService.mapJsonObjectToObject<ItemViewModel>(item);
      viewItem.Index = itemIndex;
      if (!this.relatedItemId) {
        this.translateViewItem(viewItem);
      }

      this.items.push(viewItem);
      this.originalItemsList.push(viewItem);

      if (itemIndex === 0 && viewItem.TotalCount !== -1) {
        this.eventService.setViewSection(true);

        this.totalItems = viewItem.TotalCount;
      }
    })

    setTimeout(() => {
      if (this.totalItems > this.items.length) {
        if (this.getItems === true) {
          this.getItems = false;
          this.getPagedItems(this.items.length)
        } else {
          this.getItemsIfListLessClient();
        }
      }
    }, 100)
  }

  errorResult(respError: any): any {
    let errorMapping: Array<MappingItem> = [];
    // this.commonResponseService.dispalyErrorMessages(respError, this, errorMapping, 1);
    this.loadingItemBar();
    this.titleService.setTitle(config.titles.applicationTitle);
    return respError
  }

  setEmptyItemsList() {
    switch (this.typeOfItemsList) {
      case config.itemsListsTypes.favourites:
        this.noFavouritesMessage();
        break;

      case config.itemsListsTypes.latest:

        break;

      case config.itemsListsTypes.portfolio:
        // this.router.navigate(['/upload']);
        this.eventService.setItemEditMode(undefined);
        this.snackBarService.popMessageInfo('Please upload content');
        break;

      case config.itemsListsTypes.portfolioAnonymous:

        break;

      case config.itemsListsTypes.related:

        break;

      case config.itemsListsTypes.search:
        this.labelList = this.query;
        this.noSearchResult = true;
        this.query = undefined;
        break;

      default:
        break;
    }

    this.getItems = true;
    this.totalItems = 0;
  }

  loadingItemBar() {

    this.relatedSpinner = false;
    this.eventService.setMainProgressBar(false);
    this.loadingItems = false;
    let progressSpinnerModel = new ProgressSpinnerModel(false, false);
    this.eventService.setMainProgressSpinner(progressSpinnerModel);
    this.profileDetailsHidden = false;
    // this.changeDetectorRef.detectChanges();
  }

  private setHomeInstructionMessage() {
    this.loadingItemBar();
    this.messageCard = true;
    this.messageContent = 'Save one search for home.'
      + 'When you save multiple searches, last saved search will be your home.';
  }

  private noFavouritesMessage() {
    this.messageCard = true;
    this.messageTitle = 'Favourites';
    this.messageContent = 'No favourites available. Please add items into favourites.';
    this.messageActionLable = 'Take me Home';
    this.messageCardActionRooute = '/';
  }
  //#endregion API response

  //#region Grid List View

  private changeViewSubscription() {

  this.listViewModeStateSub = this.getlistViewModeState.subscribe(
                listViewMode => {
                    this.currentViewType = listViewMode;
                    window.scroll(0, 0);
                    const docClientRect = document.scrollingElement.getBoundingClientRect();
                    this.clientWidth = docClientRect.width;
                    this.setListView();               
                }
            )

    // this.changeViewModeSubscription = this.eventService.getItemListViewMode()
    //   .subscribe(listViewType => {

    //       window.scroll(0, 0);
    //       const docClientRect = document.scrollingElement.getBoundingClientRect();
    //       this.clientWidth = docClientRect.width;
    //       // this.clientWidth = document.scrollingElement.clientWidth;
    //       // this.itemLoad = false;
    //       // this.changeDetectorRef.detectChanges();
    //       switch (listViewType) {
    //         case this.gridViewType:
    //           this.currentViewType = this.gridViewType;
    //           this.setLocalStorageItemListView(listViewType);
    //           break;
    //         case this.wallViewType:
    //           this.currentViewType = this.wallViewType;
    //           this.setLocalStorageItemListView(listViewType);
    //           break;
    //         default:
    //           break;
    //       }

    //       this.setListView();

    //   });
  }

  // setLocalStorageItemListView(listViewType: any) {
  //   localStorage.setItem(localStorageConfig.itemsListViewType, listViewType);
  // }

  private setListView() {

    // if (localStorage.getItem(localStorageConfig.itemsListViewType)) {
    //   this.currentViewType = localStorage.getItem(localStorageConfig.itemsListViewType)
    // }

    switch (this.currentViewType) {
      case this.gridViewType:
        this.appItemClass = '-view-mode';
        this.setGridListView();
        break;
      case this.wallViewType:
        this.appItemClass = '-wall';
        if (this.itemListElement) {
          setTimeout(() => {
          this.rendere2.removeStyle(this.itemListElement.nativeElement, 'height');
          this.rendere2.removeStyle(this.itemListElement.nativeElement, 'width');
          }, 50);
        }
        this.retranslateItem();
        break;
      default:
        break;
    }

    if (this.itemListElement && !this.getItems) {
      this.getItemsIfListLessClient();
    }
  }

  private setGridListView() {

    // this.itemLoad = false;
    // this.clientWidth = this.document.scrollingElement.clientWidth;
    if (this.clientWidth > this.maxGridWidth) {
      this.clientWidth = this.maxGridWidth;
    }
    this.gridColumnWidth = Math.trunc(this.clientWidth / this.numberOfColumn);
    this.itemImageWidth = this.gridColumnWidth - this.itemCardPadding

    this.gridColumns = [];
    this.gridColumnXTranslate = 0;
    this.changeDetectorRef.detectChanges();

    for (let item = 0; item < this.numberOfColumn; item++) {

      let gridColumn = new GridColumnModel(this.gridColumnXTranslate, 0);
      this.gridColumns.push(gridColumn);
      this.gridColumnXTranslate = this.gridColumnXTranslate += this.gridColumnWidth;
    }

    this.retranslateItem();
    if (this.clientWidth === this.maxGridWidth) {
      this.rendere2.setStyle(this.itemListElement.nativeElement, 'width', this.maxGridWidth + 'px');
    }

    if (this.clientWidth < this.maxGridWidth) {
      this.rendere2.setStyle(this.itemListElement.nativeElement, 'width', this.clientWidth + 'px');
    }
    this.itemLoad = true;
  }

  private retranslateItem() {
    if (this.items.length !== 0) {
      if (this.items.length > 9) {
        this.items.length = 9
      }
      // this.itemLoad = false;
      // this.changeDetectorRef.detectChanges();
      for (let item of this.items) {
        this.translateViewItem(item);
      }

      let progressSpinnerModel = new ProgressSpinnerModel(false, false);
      this.eventService.setMainProgressSpinner(progressSpinnerModel);

      // this.itemLoad = true;
      // this.changeDetectorRef.detectChanges();
    }
  }

  private translateViewItem(viewItem: ItemViewModel) {
    switch (this.currentViewType) {
      case this.gridViewType:
        let aspectRatio = viewItem.FileDetails.width / viewItem.FileDetails.height;
        this.translateGridItem(viewItem, aspectRatio);
        break;
      case this.wallViewType:
        this.itemTranslateX = 0;
        this.itemTranslateY = 0;
        break;

      default:
        break;
    }

    viewItem.TranslateX = this.itemTranslateX;
    viewItem.TranslateY = this.itemTranslateY;
  }

  translateGridItem(viewItem: ItemViewModel, aspectRatio: number) {

    let gridColumn;

    gridColumn = this.gridColumns.reduce(function(prev, current) {
      return (prev.heightTranslate <= current.heightTranslate) ? prev : current  })

    // if (viewItem.Index <= 1) {
    //   gridColumn = this.gridColumns.slice().sort((a, b) => {
    //     // return a.heightTranslate + a.widthTranslate <
    //     //  b.heightTranslate + b.widthTranslate ? -1 : 1
    //     return a.heightTranslate < b.heightTranslate ? -1 : 1
    //   })[0];
    // } else {
    //   gridColumn = this.gridColumns.slice().sort((a, b) => {
    //     return a.heightTranslate < b.heightTranslate ? -1 : 1
    //   })[0];
    // }

    this.itemTranslateX = gridColumn.widthTranslate;
    this.itemTranslateY = gridColumn.heightTranslate + config.itemCard.padding;

    let height: number;

    if (this.numberOfColumn === 1) {
      height = (this.clientWidth - 2 * config.itemCard.padding) / aspectRatio;
    } else {
      height = this.itemImageWidth / aspectRatio;
    }

    gridColumn.heightTranslate = gridColumn.heightTranslate + height + config.itemCard.padding;

    let gridColumnMax = this.gridColumnMax();
    this.rendere2.setStyle(this.itemListElement.nativeElement, 'height',
      gridColumnMax.heightTranslate + config.itemCard.padding + 'px')
  }

  private gridColumnMax() {
    return this.gridColumns.slice().sort((a, b) => {
      return a.heightTranslate > b.heightTranslate ? -1 : 1;
    })[0];
  }

  private getItemsIfListLessClient() {
    if (this.itemListElement.nativeElement.clientHeight < document.scrollingElement.clientHeight) {
      this.getPagedItems(this.items.length);
    }
  }

  //#endregion Grid List View


  // translatedItems(event) {
  //   let translatedItems = event;
  //   for (let item of translatedItems) {
  //     this.items.push(item);
  //   }
  //   this.itemLoad = true;
  //   this.changeDetectorRef.detectChanges();
  // }

  // setDeleteItemsIds(itemId: string) {
  //   this.deleteItemsIds.push(itemId);
  // }
  onOpenModalItemEmitter(index) {
    let itemsModalList = new ItemsModalListModel(index, this.items, this.typeOfItemsList);
    let id = this.items[index].Id;

    localStorage.setItem(localStorageConfig.itemsModalList, JSON.stringify(itemsModalList));
    this.router.navigate([{outlets: {a: [ 'aa', id ]}}]);
  }

  setDelete(itemId: string) {

    let itemIdToArray: string[] = [];
    itemIdToArray.push(itemId);
    this.filterItems(itemIdToArray);

    let snackBarModel = this.utilityService.setDeleteSnackBar(itemIdToArray);
    this.eventService.setSnackBarMessage(snackBarModel);
  }

  private filterItems(ids: any) {
    for (let id of ids) {
      this.items = this.items.filter(items => items.Id !== id);
      // this.originalItemsList = this.originalItemsList.filter(items => items.Id !== id);
      this.totalItems = this.totalItems - 1;
    }
    this.setListView();
    this.changingSize.next(true);
  }

  private undoDeleteItems(ids: any) {
    for (let id of ids) {
      // let index = this.originalItemsList.
      // this.originalItemsList = this.originalItemsList.filter(items => items.Id !== id);
      this.totalItems = this.totalItems + 1;
    }
    this.items = this.originalItemsList
    // this.changeDetectorRef.detectChanges()
    this.setListView();
    this.changingSize.next(true);
  }

  private deleteItemSubscription() {

    this.deleteItemsSubscription = this.eventService.getDeleteItemsAction()
      .subscribe(deleteItems => {
        switch (deleteItems.typeAction) {
          case snackBarConfig.action.setDelete:
            this.filterItems(deleteItems.entitiesIds);
            break;
          case snackBarConfig.action.undo:
            this.undoDeleteItems(deleteItems.entitiesIds);
            break;
          case snackBarConfig.type.delete:
            this.filterItems(deleteItems.entitiesIds);
            break;

          default:
            break;
        }
      });
  }

  private userSubscription() {

    this.oidcService.isAuthenticated().then(userAuthenticated => {

        this.userAuthenticated = userAuthenticated;
    })

  }

  onRemoveFavouritesItem(itemId) {
    this.items = this.items.filter(i => i.Id !== itemId);
    if (this.items.length === 0) {
      this.noFavouritesMessage();
    }
  }

  //#region Drag and Drop

  private dragAndDropSubscriptions() {
    this.itemPickedUpIdSubscription = this.favouritesListDndService.getItemPickedUpId()
      .subscribe(data => {
        this.itemIndexPickedUp = data;
      });
    this.itemHoveredIdSubscription = this.favouritesListDndService.getItemHoveredId()
      .subscribe(data => {
        this.itemIndexHover = data;
        this.favouriteItemsMove();
      });
  }

  favouriteItemsMove() {
    this.itemsChangePlace()
    this.moveItemsInArray(this.items, this.itemIndexPickedUp, this.itemIndexHover);
  }

  itemsChangePlace() {
    let item = this.items[this.itemIndexPickedUp];
    let isItemChangeIndex = this.ItemsIndexChanges.find(itemChange => itemChange === item);
    if (isItemChangeIndex === undefined) {
      this.ItemsIndexChanges.push(item);
    }
  }

  calculateItemsPlaceChanged() {
    for (let item of this.ItemsIndexChanges) {
      let originalIndex = this.originalItemsList.findIndex(i => i === item);
      let movedIndex = this.items.findIndex(i => i === item);
      let calculateItemMove = movedIndex - originalIndex;
    }
  }

  moveItemsInArray(array, fromIndex, toIndex) {
    let item = this.items[fromIndex];
    array.splice(fromIndex, 1);
    array.splice(toIndex, 0, item);
    this.itemIndexPickedUp = toIndex;
  }
  //#endregion Drag and Drop

  trackByItems(index, item: ItemViewModel) {
    item.Index = index;
    return index; // or item.id
  }
}
