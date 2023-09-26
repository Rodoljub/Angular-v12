import { Component, OnInit, Input, Inject, PLATFORM_ID, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState, selectSearchFormState } from '../../../../../store/app.state';
import { SearchFormModel } from '../../../../../features/search/SearchFormModel';
import { AddSearchForm, AddSelectedTag, ChangeSearch } from '../../../../../store/actions/search-form.actions';

@Component({
    selector: 'app-item-tag',
    templateUrl: './item-tag.component.html',
    styleUrls: ['item-tag.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatTagComponent implements OnInit, OnDestroy {
    @Input() tag: string;
    // @Input() selectedTags: string[];
    @Input() disabled = false;
    @Input() isSelectedTag = false;
    @Input() touchDevice: boolean;

    getSearchFormStateSub: Subscription;
    getSearchFormState: Observable<SearchFormModel>;
    searchForm: SearchFormModel;

    eventStartClientX: number;
    tagTouchTimeout: NodeJS.Timer;
    isTagSelected = false;
    selectedTagClass = '';

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private changeDetectorRef: ChangeDetectorRef,
        private store: Store<AppState>
    ) {
      this.getSearchFormState = this.store.select(selectSearchFormState);


    }

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {

          this.getSearchFormStateSub = this.getSearchFormState.subscribe(searchForm => {
            this.searchForm = searchForm;
            if (searchForm.selectedTags && searchForm.selectedTags.find(t => t === this.tag)) {
              this.selectedTagClass = 'selected';
            } else {
              this.selectedTagClass = '';
            }

            if (!this.changeDetectorRef['destroyed']) {
              this.changeDetectorRef.detectChanges();
          }
          })
        }
    }

    ngOnDestroy() {
      if (this.getSearchFormStateSub) {
        this.getSearchFormStateSub.unsubscribe();
      }
    }

    onMouseDownTag(event: MouseEvent, tag) {
      if (!this.touchDevice) {
        this.eventStartClientX = event.clientX;

        this.setTagEventStart(tag);
      }
    }

    onMouseUpTag(event: MouseEvent, tag) {
      if (!this.touchDevice) {
        let eventEndClientX = event.clientX;

        this.setTagEventEnd(eventEndClientX, tag);
      }
    }

    onTagTouchStart(event: TouchEvent, tag) {
      this.eventStartClientX = event.changedTouches[0].clientX;

      this.setTagEventStart(tag);
    }

    onTagTouchMove() {
      clearTimeout(this.tagTouchTimeout);
    }

    onTagTouchEnd(event: TouchEvent, tag) {
      // event.stopPropagation();
      let eventEndClientX = event.changedTouches[0].clientX;

      this.setTagEventEnd(eventEndClientX, tag);
    }

    private setTagEventStart(tag: string) {
      if (!this.disabled) {
        this.tagTouchTimeout = setTimeout(() => {
          this.isTagSelected = true;
          const searchForm = new SearchFormModel(true, this.searchForm.input, [...this.searchForm.selectedTags, tag], false);
          this.store.dispatch(new AddSearchForm(searchForm));
          // this.store.dispatch(new AddSelectedTag(tag));
        }, 100);
      }
    }

    private setTagEventEnd(eventEndClientX: number, tag: string) {
      if (!this.disabled) {
        if (this.eventStartClientX === eventEndClientX && !this.isTagSelected) {
          // this.store.dispatch(new AddSelectedTag(tag));
          if (this.searchForm && this.searchForm.selectedTags && this.searchForm.selectedTags.length === 0) {
            // this.store.dispatch(new ChangeSearch(true));
            const searchForm = new SearchFormModel(true, this.searchForm.input, [...this.searchForm.selectedTags, tag], true);
            this.store.dispatch(new AddSearchForm(searchForm));
          } else {
            const searchForm = new SearchFormModel(true, this.searchForm.input, [...this.searchForm.selectedTags, tag], false);
            this.store.dispatch(new AddSearchForm(searchForm));
          }
        }

        this.isTagSelected = false;
        clearTimeout(this.tagTouchTimeout);
      }

    }
}
