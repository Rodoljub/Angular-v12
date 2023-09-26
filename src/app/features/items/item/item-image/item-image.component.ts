import { Component, OnInit, ElementRef, ViewChild, Output, EventEmitter,
     Input, AfterViewInit, Inject,
     PLATFORM_ID, Renderer2, ViewEncapsulation, HostListener, OnDestroy, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { config } from '../../../../../config/config';
import { Subject, Subscription } from 'rxjs';
import { ItemViewModel } from '../ItemViewModel';

@Component({
    selector: 'app-item-image',
    templateUrl: './item-image.component.html',
    styleUrls: ['item-image.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ItemImageComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
    @Input() item: ItemViewModel;
    @Input() itemFilePath: string;
    @Input() listViewType: string;

    @Input() imageHeight: number;
    @Input() translate: number;
    @Input() changingSize: Subject<boolean>;
    @Input() isMobileView: boolean;
    @Input() flipImage = false;
 
    altImage = '';
    itemCaption = '';

    @ViewChild('colorElement', {static: false}) colorElement: ElementRef;
    @ViewChild('imageElement', {static: false}) imageElement: ElementRef;

    @Output() doubleTapAction = new EventEmitter<boolean>()
    @Output() doubleTapLikeTrigger = new EventEmitter();
    @Output() openCarouselItemEmit = new EventEmitter();

    changingSizeSubscription: Subscription;

    currentView: string;

    wallView = config.listViewTypes.wall;
    gridView = config.listViewTypes.grid;
    carouselView = config.listViewTypes.carousel;

    itemImageLoading = true;
    itemImageBackgroundRelative = '';


    isLikeAnimation = false;

    likeAnimationItemShow = ''

    tapCount = 0;

    doubleTapLikeTimer: NodeJS.Timer;
    itemWallCardWidth: number;

    touchDevice = false;

    webPImagePath: string;

    iifwRotateClass = 'iifw';
    iifwClass = '';

    descflip = 'description';
    imgflip = 'image';
    svgIconFlip = 'description';

    description: string;
    isDescription = false;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private renderer2: Renderer2,
        private changeDetectorRef: ChangeDetectorRef,
    ) { }

    @HostListener('window:resize')
    onwindowResize() {
      if (this.listViewType === config.listViewTypes.carousel) {
        const resizeEventWidth = document.scrollingElement.clientWidth;
        if (resizeEventWidth > config.clientWidthBrake.middel) {
          this.itemImageBackgroundRelative = 'item-image-background-relative';
        } else {
          this.itemImageBackgroundRelative = '';
        }
      }

      this.touchDevice = false;
    }

    get isItemCaption() {
      if(this.listViewType === this.gridView) {
        return false;
      }
      return true;
    }


    ngOnInit() {
      if (isPlatformBrowser(this.platformId)) {

        // document.addEventListener('contextmenu', event1 => {event1.preventDefault()
        // event1.stopPropagation()});

        this.setAltImage();
        if (this.item.Description === null) {
          this.description = '';
        } else {
          this.description = this.item.Description
        }
        
        
        this.webPImagePath = config.mediaImage + this.itemFilePath + config.webpExtansion;
        this.currentView = this.listViewType;
        if (this.changingSize) {
            this.changingSizeSubscription = this.changingSize.subscribe(v => {
              this.setItemImageElements();
         });
        }
      }
    }

    ngAfterViewInit() {
        if (isPlatformBrowser(this.platformId)) {
          this.setItemImageElements();
          this.renderer2.listen(this.imageElement.nativeElement, 'contextmenu', event => {
            event.preventDefault();
            event.stopPropagation()
            // return false;
          })

          const noContext = document.getElementById('item-image');

          noContext.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            e.stopPropagation()

        }, false);
        }
    }

    ngOnChanges(changes: SimpleChanges) {
      if (changes.translate && !changes.translate.firstChange) {
        if (changes.translate.currentValue !== changes.translate.previousValue) {
          this.setItemImageElements();
        }
      }

      if (changes.flipImage && !changes.flipImage.firstChange) {
        if (changes.flipImage.currentValue !== changes.flipImage.previousValue) {
          this.flipImageDesc();
        }
      }
    }

    ngOnDestroy() {
      if (this.changingSizeSubscription) {
        this.changingSizeSubscription.unsubscribe();
      }
    }

    setAltImage() {
      const i = this.item.FileDetails.imageAnalysis;
      if (i && i.description && i.description.captions
        && i.description.captions.length > 0
        && i.description.captions[0].text
      ) {
        this.altImage = i.description.captions[0].text
        this.itemCaption = i.description.captions[0].text;
      } else if (
        this.item.Tags.length > 0
      ) {
        this.altImage = this.item.Tags.toString();
      }
    }

    onImageLoading(event) {
      if (event) {
        this.renderer2.setStyle(this.imageElement.nativeElement, 'display', 'none');
      } else {
        this.renderer2.removeStyle(this.imageElement.nativeElement, 'display');
      }
      this.itemImageLoading = event;
    }

    setItemImageElements() {
      if (this.description.trim().length > 0 && this.listViewType !== config.listViewTypes.grid) {
        this.isDescription = true;
      } else {
        this.isDescription = false;
      }
      switch (this.listViewType) {
        case this.wallView:
          this.wallAfterViewInit();
          break;
        case this.gridView:
          this.gridAfterViewInit();
            break;
        case this.carouselView:
          this.carouselAfterViewInit();
          break;
        default:
          break;
      }
    }

    private wallAfterViewInit() {

      this.itemWallCardWidth = document.getElementById('wallItemColumnElement').clientWidth;

      this.imageHeight = this.itemWallCardWidth / (this.item.FileDetails.width / this.item.FileDetails.height);

      this.renderer2.setStyle(this.imageElement.nativeElement, 'position', 'relative');
        this.renderer2.setStyle(this.imageElement.nativeElement, 'border-radius', '0');
        // this.renderer2.setStyle(this.imageElement.nativeElement, 'min-height', this.imageHeight + 'px');

      if (this.colorElement) {
        this.renderer2.setStyle(this.colorElement.nativeElement, 'position', 'relative');
        this.renderer2.setStyle(this.colorElement.nativeElement, 'border-radius', '0');
        this.renderer2.setStyle(this.colorElement.nativeElement, 'min-height', this.imageHeight + 'px');
        this.renderer2.setStyle(this.colorElement.nativeElement, 'height', this.imageHeight + 'px');
        this.renderer2.setStyle(this.colorElement.nativeElement, 'background', 'linear-gradient(-45deg,'
            + this.item.FileDetails.color + ',#fff');
      }
    }

    private gridAfterViewInit() {
      this.renderer2.removeStyle(this.imageElement.nativeElement, 'position');
      this.renderer2.removeStyle(this.imageElement.nativeElement, 'border-radius');
      // this.renderer2.setStyle(this.imageElement.nativeElement, 'min-height', this.imageHeight + 'px');
      if (this.colorElement) {
        this.renderer2.setStyle(this.colorElement.nativeElement, 'background', 'linear-gradient(-45deg,'
        + this.item.FileDetails.color + ',#fff');
        this.renderer2.removeStyle(this.colorElement.nativeElement, 'position');
        this.renderer2.removeStyle(this.colorElement.nativeElement, 'border-radius');
        this.renderer2.removeStyle(this.colorElement.nativeElement, 'min-height');
        this.renderer2.removeStyle(this.colorElement.nativeElement, 'height');
      }
    }

    private carouselAfterViewInit() {
      let imageWidth: number;
      const clientHeight = document.body.clientHeight;
      if (this.item.FileDetails.height >= this.item.FileDetails.width) {
        this.imageHeight = clientHeight;
        imageWidth = this.imageHeight / (this.item.FileDetails.height / this.item.FileDetails.width);
      } else {
        this.itemWallCardWidth = document.getElementById('app-item-detail').clientWidth;
        this.imageHeight = this.itemWallCardWidth / (this.item.FileDetails.width / this.item.FileDetails.height);
        imageWidth = this.itemWallCardWidth;
      }
      if (this.colorElement) {
        this.renderer2.setStyle(this.colorElement.nativeElement, 'border-radius', '0');
        const resizeEventWidth = document.scrollingElement.clientWidth;
        if (resizeEventWidth < config.clientWidthBrake.middel || this.listViewType !== config.listViewTypes.carousel) {
          this.renderer2.setStyle(this.colorElement.nativeElement, 'background', 'linear-gradient(-45deg,'
            + this.item.FileDetails.color + ',#fff');
        } else {
          this.renderer2.setStyle(this.colorElement.nativeElement, 'background', 'white');
        }
      }
    }

    onMouseDown(event) {
    }

    onMouseUp(event) {
    }

    onClick(event) {
      if (!this.touchDevice) {
        this.openCarouselItem();
      }
    }

    onDragStart(event) {
      event.preventDefault();
    }

    onContextMenu(event) {
      // return false;
      // event.preventDefault();
    }
    onTouchStart(event) {

      // window.oncontextmenu = function() { return false; }
      // const noContext = document.getElementById('item-image');
      // noContext.oncontextmenu = function (e) { // Use document as opposed to window for IE8 compatibility
      //   e.preventDefault();
      //   return false;
      // };

      // event.preventDefault();
      this.touchDevice = true;
    }

    onTouchMove(event) {
      this.tapCount = -1;

      if (this.doubleTapLikeTimer) {
        clearTimeout(this.doubleTapLikeTimer);
      }
    }

    onTouchEnd(event) {
      this.doubleTapAction.emit(false);
      this.tapCount++;
      this.doubleTapLikeTimer = setTimeout(() => {

        if (this.tapCount === 1) {
          this.tapCount = 0;
          this.openCarouselItem();
        }
        if (this.tapCount > 1) {
          this.tapCount = 0;
          this.doubleTapAction.emit(true);
          this.doubleTapLikeTrigger.emit();
          this.likeAnimationItemShow = 'like-animation-item-show';
          this.isLikeAnimation = true;
          clearTimeout(this.doubleTapLikeTimer);
          this.changeDetectorRef.detectChanges();
        }
      }, 250);

      setTimeout(() => {

        this.likeAnimationItemShow = '';
        this.isLikeAnimation = false;
        // this.tapCount = 0;
        this.changeDetectorRef.detectChanges();
      }, 1000)
    }

    doubleTapLike(event) {
    this.doubleTapAction.emit(false);
    this.tapCount++;
    this.doubleTapLikeTimer = setTimeout(() => {

      if (this.tapCount === 1) {
        this.tapCount = 0;

      }
      if (this.tapCount > 1) {
        this.tapCount = 0;
        this.doubleTapAction.emit(true);
        this.doubleTapLikeTrigger.emit();
        this.likeAnimationItemShow = 'like-animation-item-show';
        this.isLikeAnimation = true;
        // clearTimeout(that.doubleTapLikeTimer);
        this.changeDetectorRef.detectChanges();
      }
    }, 250);



      setTimeout(() => {

        this.likeAnimationItemShow = '';
        this.isLikeAnimation = false;
        // this.tapCount = 0;
        this.changeDetectorRef.detectChanges();
      }, 1000)

    }

    doubleTapMove() {
      this.tapCount = 0;

      if (this.doubleTapLikeTimer) {
        clearTimeout(this.doubleTapLikeTimer);
      }

    }

    doubleTapEnd() {
      // if (this.tapCount === 0) {

      //   clearTimeout(this.doubleTapLikeTimer);
      // }
    }

    openCarouselItem() {
      console.log('click')
      if (this.listViewType === this.carouselView ||
        (this.isMobileView && this.listViewType === this.wallView)) {
        
      } else {
        this.openCarouselItemEmit.emit();
      }
    }

    flipImageDesc() {
      if (this.svgIconFlip === this.descflip) {
        this.iifwClass = this.iifwRotateClass;
        this.svgIconFlip = this.imgflip;
      } else {
        this.iifwClass = '';
        this.svgIconFlip = this.descflip;
      }
    }
}
