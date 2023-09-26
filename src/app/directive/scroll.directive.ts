import {
  Directive, HostListener, Inject, EventEmitter,
  Output, Renderer2, ContentChild, ViewChild, ElementRef, OnInit, AfterViewInit, AfterContentInit, PLATFORM_ID, Input, OnDestroy
} from '@angular/core';

import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { EventService } from '../services/utility/event.service';
import { Observable, Subscription } from 'rxjs';
import { SearchFormModel } from '../features/search/SearchFormModel';
import { Store } from '@ngrx/store';
import { AppState, selectSearchFormState } from '../store/app.state';

@Directive({
  selector: '[appScroll]'
})
export class ScrollDirective implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {

  @Input() headerTranslateEnable = false;
  // @Input() searchInputIsOpen: boolean;
  scrollTopStart = 0;
  lastScrollY = 0;
  scroll = false;
  scrollY
  scrollYDirection = '';
  scrollTranslate;
  headerHeightTranslate: number;
  @ContentChild('header') private headerElement: ElementRef;
  header: any;
  headerMaxTranslate = true;
  touchStartY: number;
  touchEndY: number;

  getSearchFormState: Observable<SearchFormModel>;



  constructor(
    private store: Store<AppState>,
    @Inject(DOCUMENT) private document: Document,
    private eventService: EventService,
    private renderer2: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object,
    private elRef: ElementRef
  ) {
    this.getSearchFormState = this.store.select(selectSearchFormState);

    // this.scrollTopStart = document.documentElement.scrollTop;
    // this.lastScrollY = document.documentElement.scrollTop;
    // this.scrollY = this.document.documentElement.scrollTop;
    // this.document.documentElement.scroll(0, 0)
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll($event) {
    if (isPlatformBrowser(this.platformId)) {
    let clientWidth = this.document.scrollingElement.clientWidth;

    this.headerHeightTranslate = this.elRef.nativeElement.clientHeight;

    if (clientWidth <= 961 || this.headerTranslateEnable) {

      const domRect = this.header.getBoundingClientRect();
      this.scrollY = document.documentElement.scrollTop;
      let diff

      if (this.scrollY < this.lastScrollY) {

        diff = this.lastScrollY - this.scrollY
        this.scrollTranslate = domRect.top + diff

        if ((domRect.top + diff) > 0) {
          this.scrollTranslate = 0
        }

        this.renderer2.setStyle(this.header, 'transform', 'translateY(' + (this.scrollTranslate) + 'px)');

      }

      if (this.scrollY > this.lastScrollY) {

        diff = this.scrollY - this.lastScrollY
        this.scrollTranslate = domRect.top - diff

        if ((domRect.top - diff) < -this.headerHeightTranslate) {
          this.scrollTranslate = -this.headerHeightTranslate
        }
        //  else {
        //   this.scrollTranslate = 0;
        // }

        this.renderer2.setStyle(this.header, 'transform', 'translateY(' + (this.scrollTranslate) + 'px)');

      }
      // this.renderer2.setStyle(this.header, 'transform', 'translateY(' + (this.scrollTranslate) + 'px)');

      this.lastScrollY = scrollY;

    }
  }
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {

      // window.scroll(0, 0)





  }
  }

  private setHeaderVisible(domRect: any) {
    let bodyRect = document.getElementById('app-wrapper').getBoundingClientRect();
    let scroll = bodyRect.top - domRect.top;
    window.scrollTo(0, -scroll);
  }

  ngAfterViewInit() {

    this.getSearchFormState.subscribe((searchForm) => {
      const domRect = this.header.getBoundingClientRect();
      if (domRect.top < 0) {
        this.setHeaderVisible(domRect);
      }
    })


  }

  ngAfterContentInit() {
    this.header = this.elRef.nativeElement;

    let clientWidth = this.document.scrollingElement.clientWidth;

    this.headerHeightTranslate = this.elRef.nativeElement.clientHeight;

    if (clientWidth <= 961) {

      this.renderer2.listen(this.document.body, 'touchstart', touchstart => {
        this.touchStartY = touchstart.targetTouches[0].clientY;
      })

      this.renderer2.listen(this.document.body, 'touchend', touchend => {

        setTimeout(() => {
          this.touchEndY = touchend.changedTouches[0].clientY;
          const domRect = this.header.getBoundingClientRect();

          if (domRect.top < 0 && domRect.top > -this.headerHeightTranslate / 2) {
             this.setHeaderVisible(domRect);
          }

          if (domRect.top <= -this.headerHeightTranslate / 2 && domRect.top > -this.headerHeightTranslate) {
            let bodyRect = document.getElementById('app-wrapper').getBoundingClientRect()
            let scroll = bodyRect.top + (-this.headerHeightTranslate - domRect.top)
            window.scrollTo(0, -scroll)
          }
        }, 100)
      })
    }
  }

  ngOnDestroy() {

  }
}
