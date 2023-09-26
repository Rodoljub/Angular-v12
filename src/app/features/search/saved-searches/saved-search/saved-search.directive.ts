import { Directive, AfterViewInit, OnInit, ElementRef,
    Inject, PLATFORM_ID, HostListener, Renderer2, ContentChild, EventEmitter, Output, Input } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { config } from '../../../../../config/config';
import { SaveSearchResultModel } from '../../SaveSearchResultModel';
import { SearchFormModel } from '../../SearchFormModel';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/app.state';
import { AddSearchForm } from '../../../..//store/actions/search-form.actions';

@Directive({
    selector: '[app-saved-search-directive]',
})
export class SavedSearchDirective implements OnInit, AfterViewInit {
  @Input() saveSearchResult: SaveSearchResultModel;
    overElement: any;
    underElement: any;
    @ContentChild('overElement', {static: false}) private overElementRef: ElementRef;
    @ContentChild('underElement', {static: false}) private underElementRef: ElementRef;
    isMouseDown = false;
    movement: any;

    // @Output() changeActionType = new EventEmitter<string>();
    // @Output() setActionType = new EventEmitter<string>();

    touchMovex: any;
    touchStartY: any;
    touchPageY: any;
    touchStartX: any;
    horizontalScroll = false;
    // isSwipe = false;
    leftDifferentStart: number;
    isFirstMove = true;

    isClick = true;

    constructor(
      private store: Store<AppState>,

        @Inject(PLATFORM_ID) private platformId: Object,
        // private overElementRef: ElementRef,
        private renderer2: Renderer2
    ) {}

    @HostListener('mousedown', ['$event'])
    onMouseDown() {
        this.isClick = true;
        this.isMouseDown = true;
    }

    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent) {
        if (this.isMouseDown) {
            this.isClick = false;
            this.moveTags(event.movementX, event);
        }
    }

    @HostListener('mouseup', ['$event'])
    onMouseUp(event) {
        this.isMouseDown = false;
    }


    @HostListener('click', ['$event'])
    onClick(event) {
        if (this.isClick) {
          const input = this.saveSearchResult.searchText || '';
          const searchForm = new SearchFormModel(
              true,
              input,
              this.saveSearchResult.searchTags,
              true
          )
          this.store.dispatch(new AddSearchForm(searchForm))
        } else {
          // event.stopPropagation();
        }
        this.isClick = true;
        this.isMouseDown = false;
    }

    @HostListener('mouseout', ['$event'])
    onMouseOut() {
        // this.isMouseDown = false;
    }

    @HostListener('touchstart', ['$event'])
    onTouchStart(event) {
      const container = this.underElementRef.nativeElement;
      const underElement = container.getBoundingClientRect();
      const overElement = this.overElement.getBoundingClientRect();
      this.leftDifferentStart = underElement.left - overElement.left;

      this.touchMovex = event.targetTouches[0].clientX;
      this.touchStartY = event.targetTouches[0].clientY;
      this.touchPageY = document.body.scrollTop;
      this.isMouseDown = true;

    //   if (this.container.clientWidth < this.draggable.clientWidth) {
        this.renderer2.addClass(this.overElement, 'container-hover');
    //   }
    }

    @HostListener('touchmove', ['$event'])
    onTouchMove(event) {
        // event.preventDefault();
        let touchemoveX = event.targetTouches[0].clientX;
        let touchmoveY = event.targetTouches[0].clientY;
        let movementX = touchemoveX - this.touchMovex;
        let movementY = touchmoveY - this.touchStartY
        this.touchMovex = touchemoveX;

        if (this.isFirstMove) {
          this.isFirstMove = false;
          if (Math.abs(movementX) - 2 >= Math.abs(movementY)
        //  || this.horizontalScroll
         ) {
           this.horizontalScroll = true;
         } else {
           this.horizontalScroll = false;
         }
        }
        if (
          // Math.abs(movementX) - 2 >= Math.abs(movementY)
        //  ||
         this.horizontalScroll
         ) {
          this.horizontalScroll = true;
          this.moveTags(movementX, event);
        } else {
          // this.horizontalScroll = false;
            // if (!this.horizontalScroll) {
              let bodyRect = document.getElementById('app-wrapper').getBoundingClientRect();
              let scroll = bodyRect.top + movementY
              window.scrollTo(0, -scroll)
            // }
        }

        this.touchMovex = event.targetTouches[0].clientX;
        this.touchStartY = event.targetTouches[0].clientY;

    }

    @HostListener('touchend', ['$event'])
    onTouchEnd(event) {
        // this.horizontalScroll = false;
        this.isFirstMove = true;
        let touchEndX = event.changedTouches[0].clientX;
        if (this.touchStartX === touchEndX) {
          let isTag = event.srcElement.localName
            if (isTag === 'mat-chip') {
              let tag = event.srcElement.lastChild.nodeValue.trim();
              // this.selectTag(tag);
            }
        }
        this.renderer2.removeClass(this.overElement, 'container-hover')

        const container = this.underElementRef.nativeElement;
        const underElement = container.getBoundingClientRect();
        const overElement = this.overElement.getBoundingClientRect();
        let leftDifferent = underElement.left - overElement.left;

        let translate = 0;
        if (this.leftDifferentStart === 0) {

          if (leftDifferent < -30) {
            translate = 210;
          } else {
            if (leftDifferent > 30) {
              translate = -210;
            } else {
              translate = 0;
            }
          }
        } else {
          if (leftDifferent === 210 || leftDifferent === -210) {
            translate = -leftDifferent;
          }
        }

      // let translate = 0;
      this.renderer2.setStyle(this.overElement, 'transform', 'translateX(' + (translate) + 'px)');
    }

    moveTags(movementX: number, event) {

        const container = this.underElementRef.nativeElement;
        const underElement = container.getBoundingClientRect();
        const overElement = this.overElement.getBoundingClientRect();


        let leftDifferent = underElement.left - overElement.left;
        this.movement = overElement.left + movementX;
        let translate = movementX

          if (this.isMouseDown) {

            translate = movementX - leftDifferent;

            if (translate < 0) {

                this.renderer2.setStyle(this.underElementRef.nativeElement, 'flex-direction', 'row');

            }

            if (translate > 0) {
              this.renderer2.setStyle(this.underElementRef.nativeElement, 'flex-direction', 'row-reverse');
            }

            if (translate < -210) {
              translate = -210;
            }

            if (translate > 210) {
              translate = 210;
            }

            if (leftDifferent < -60) {
                // this.changeActionType.emit(config.actionIconTypes.delete);
            } else {
                // this.changeActionType.emit(config.actionIconTypes.edit);
            }

            // translate = movementX - left;

            this.renderer2.setStyle(this.overElement, 'transform', 'translateX(' + (translate) + 'px)');
          }
      }


    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {}
    }

    ngAfterViewInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.overElement = this.overElementRef.nativeElement;
        }
    }
}
