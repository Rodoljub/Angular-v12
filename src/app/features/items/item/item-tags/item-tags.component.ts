import { Component, OnInit, Input, ViewChild, ElementRef,
   AfterViewInit, Inject, PLATFORM_ID, HostListener, Renderer2, Output,
   EventEmitter, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';

import { EventService } from '../../../../services/utility/event.service';
import { isPlatformBrowser } from '@angular/common';
import { config } from '../../../../../config/config';
import { Observable, Subscription } from 'rxjs';
import { ItemViewModel } from '../ItemViewModel';
import { AppState, selectItemTagsState, selectSearchFormState } from '../../../../store/app.state';
import { Store } from '@ngrx/store';
import { SearchFormModel } from '../../../../features/search/SearchFormModel';
import { ChangeSearchFormOpen } from '../../../../store/actions/search-form.actions';
import { ChangeItemTagsState } from './store/item-tags.actions';

@Component({
  selector: 'app-item-tags',
  templateUrl: './item-tags.component.html',
  styleUrls: ['item-tags.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemTagsComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {

  @Input() item: ItemViewModel;
  @Input() detailItem: ItemViewModel;
  @Input() isMobileView: boolean;
  @Input() currentViewType: string;
  @Input() typeOfItemsList: string;
  @Input() tagDisabled = false;
  @Input() isSelectedTag = false;
  @Input() activeShowMoreTagClass = '';

  @Output() closeDetailItem = new EventEmitter();

  getSearchFormStateSub: Subscription;
  getSearchFormState: Observable<SearchFormModel>;
  searchForm: SearchFormModel;

  getItemTagsStateSub: Subscription;
  getItemTagsState: Observable<boolean>;
  itemTagsState: boolean;

  userImagePath: string;

  portfolioItemList = config.itemsListsTypes.portfolio;
  portfolioAnonimous = config.itemsListsTypes.portfolioAnonymous;

  paddingDraggable = 10;

  gridViewItem = config.listViewTypes.grid;
  wallViewItem = config.listViewTypes.wall;

  // eventStartClientX: number;

  @ViewChild('tagListElement', {static: false}) tagListElement: ElementRef;
  // @ViewChild('expanderChipList') expanderChipList: ElementRef;
  @ViewChild('showHideTagsElement', {static: false}) showHideTagsElement: ElementRef;

  openListClass = '';
  rotateIconClass = '';

  showMoreTags = false;
  isTagsOpen = false;

  selectedTags: string[] = [];
  showMoreTagsTimeout: NodeJS.Timer;
  showCloseItemModelTag: boolean;

  touchDevice: boolean;
  detectUserAgentPlatformRegX = new RegExp(config.detectUserAgentPlatformRegX);


  // isTagSelected = false;

  // tagTouchTimeout: NodeJS.Timer;


  constructor(
    private router: Router,
    private eventService: EventService,
    private renderer2: Renderer2,
    private changeDetectorRef: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object,
    private store: Store<AppState>
  ) {
    this.getSearchFormState = this.store.select(selectSearchFormState);
    this.getItemTagsState = this.store.select(selectItemTagsState);
  }

  @HostListener('window: resize')
  onWindowResize() {
    this.setDeviceView()
    this.setShowMoreTags();
    if (this.detailItem) {
      this.setCloseItemModalTag()
    }
  }

  private setDeviceView() {
    this.touchDevice = this.detectUserAgentPlatformRegX.test(navigator.appVersion);
  }

  setCloseItemModalTag() {
    const clientWidth = document.body.clientWidth;
    if (clientWidth >= 569) {
      this.showCloseItemModelTag = false;
    } else {
      this.showCloseItemModelTag = true;
    }
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.item.Tags = this.item.Tags.filter((n, i) => this.item.Tags.indexOf(n) === i);
      this.setDeviceView();
      if (this.item && this.item.UserProfile) {
        if (this.item.UserProfile.userImagePath === null) {
          this.userImagePath = config.defaultProfilePicture;
        } else {
          this.userImagePath = this.item.UserProfile.userImagePath;
        }
      }

      this.getSearchFormStateSub = this.getSearchFormState.subscribe(searchForm => {
        this.searchForm = searchForm;
        this.sortBy();
        if (!this.changeDetectorRef['destroyed']) {
          this.changeDetectorRef.detectChanges();
        }
      });

      this.getItemTagsStateSub = this.getItemTagsState.subscribe(itemTagsState => {
        if (this.currentViewType === config.listViewTypes.carousel) {
          this.itemTagsState = itemTagsState;
          this.isTagsOpen = itemTagsState;
          this.setClass();
          this.changeDetectorRef.detectChanges();
        }
      })

      this.setCloseItemModalTag();
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {

      if (this.getSearchFormStateSub) {
        this.getSearchFormStateSub.unsubscribe();
      }

      if (this.getItemTagsStateSub) {
        this.getItemTagsStateSub.unsubscribe();
      }

      if (this.showMoreTagsTimeout) {
        clearTimeout(this.showMoreTagsTimeout);
      }
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      // this.setShowMoreTags();
    }
  }

  ngAfterViewChecked() {
    if (isPlatformBrowser(this.platformId)) {
      this.setShowMoreTags();
    }
  }

  sortBy() {
    const selTags = this.searchForm.selectedTags;

    if (selTags.length > 0)
    return this.item.Tags.sort((a, b) =>
        selTags.find(t => t !== a && t === b) ? 1 :
        selTags.find(t => t === a && t !== b) ? -1 :
        selTags.find(t => t === a && t === b) ? 0 : 0
    )
  }

  private setShowMoreTags() {

    // this.showMoreTagsTimeout = setTimeout(() => {
      let viewHeight = this.tagListElement.nativeElement.offsetHeight;

      if (viewHeight > 55) {
        this.showMoreTags = true;
      } else {
        this.showMoreTags = false;
      }
      this.changeDetectorRef.detectChanges();
    // }, 1000);
  }

  showHideTags() {
    this.setClass();

    this.isTagsOpen = this.isTagsOpen ? false : true;

    if (this.currentViewType === config.listViewTypes.carousel) {
      this.store.dispatch(new ChangeItemTagsState(this.isTagsOpen));
    }
  }

  private setClass() {
    if (this.isTagsOpen) {
      this.openListClass = '';
      this.rotateIconClass = '';
    } else {
      this.rotateIconClass = 'rotate';
      this.openListClass = '-open';
    }
  }

  onUserTagClick($event, urlSegment) {
    this.store.dispatch(new ChangeSearchFormOpen(false));
    // if (this.detailItem) {
      setTimeout(() => {
        this.closeDetailItem.emit();
      }, 0)

    // }

    this.router.navigate(['', 'user', urlSegment]);
  }

  closeItem(event) {
    this.closeDetailItem.emit();
  }


}
