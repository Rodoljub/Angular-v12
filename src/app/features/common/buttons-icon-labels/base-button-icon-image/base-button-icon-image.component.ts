import { Component, OnInit, Input, Output,
    EventEmitter, ViewChild, HostListener,
    ChangeDetectionStrategy, ChangeDetectorRef, PLATFORM_ID, Inject,
    ElementRef, AfterViewInit, SimpleChanges, OnChanges, Renderer2 } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { UtilityService } from '../../../../services/utility/utility.service';
import { config } from '../../../../../config/config';
import { MatTooltip, TooltipPosition } from '@angular/material/tooltip';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'app-base-button-icon-image',
    templateUrl: './base-button-icon-image.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaseButtonIconImageComponent implements OnInit, AfterViewInit, OnChanges {

    @Input() imgButton = false;
    @Input() matIcon = false;
    @Input() svgInner = false;
    @Input() svgIcon: string;
    @Input() imagePath: string;
    @Input() isHeaderProfileImg: boolean;
    @Input() isCount = false;
    @Input() count = 0;
    @Input() iconClass: string;
    @Input() tooltip: string;
    @Input() tooltipPosition: TooltipPosition = 'below';
    @Input() tooltipClass: string[] = [];

    @Output() clickOnIcon = new EventEmitter<any>();

    positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];
    position = new FormControl(this.tooltipPosition);

    tooltipShowDelay = config.tooltips.showDelay;

    private tempTooltipClass: string[] = []

    @ViewChild('headerIconTooltip', {static: true}) headerIconTooltip: MatTooltip;
    @ViewChild('iconPathElement', {static: false}) iconPathElement: ElementRef;

    actionIconTouchTimeout: NodeJS.Timer;
    headerIconTooltipTouch: boolean;

    tooltipShowTimeout: NodeJS.Timer;

    disabled = true;

    isTouchDevice = false;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        @Inject(PLATFORM_ID) private platformId: Object,
        private utilityService: UtilityService,
        private renderer2: Renderer2
    ) { }

    @HostListener('window:resize', ['$event'])
    resize(event) {
      this.isTouchDevice = false;
    }

    @HostListener('mouseenter', ['$event'])
    onMouseEnter(event) {
      event.preventDefault();
      event.stopPropagation();

      // this.tooltipShowTimeout = setTimeout(() => {
      //   this.showTooltip();
      // }, this.tooltipShowDelay)

    }

    @HostListener('mouseleave', ['$event'])
    onMouseLeave(event) {
      this.headerIconTooltip.disabled = true;
      clearTimeout(this.tooltipShowTimeout);
    }

    @HostListener('touchstart', ['$event'])
    ontouchstart(event) {
      if (!this.isTouchDevice) {
        this.isTouchDevice = true;
      }
      // event.preventDefault();
      this.actionIconTouchStart(event);
    }

    actionIconTouchStart(event) {
      // if (this.actionIconTouchTimeout) {
        this.headerIconTooltip.disabled = true;
        this.actionIconTouchTimeout = setTimeout(() => {
          this.headerIconTooltipTouch = true;

          this.setTooltipClassRelative(event);
          this.showTooltip();
          // this.headerIconTooltip.hide();
          // this.changeDetectorRef.detectChanges();
        }, 500);

        setTimeout(() => {
          this.headerIconTooltip.hide();
        }, 1000)
      // }

    }

    @HostListener('touchmove', ['$event'])
    ontouchmove(event) {
      clearTimeout(this.actionIconTouchTimeout);
      if (this.headerIconTooltip._isTooltipVisible) {
        this.setTooltipClassRelative(event);

      }
      this.headerIconTooltipTouch = true;
    }

  private setTooltipClassRelative(event: any) {
    const clientY = event.changedTouches[0].clientY;
    const clientYHeight = document.scrollingElement.clientHeight;
    if (clientY < 120) {
      if (this.headerIconTooltip.position === 'above') {
        this.tooltipPosition = 'below';
        const toolClass = this.setTooltipClass();
        this.headerIconTooltip.tooltipClass = toolClass;
      }
    }
    if (clientYHeight - clientY < 120) {
      if (this.headerIconTooltip.position === 'below') {
        this.tooltipPosition = 'above';
        const toolClass = this.setTooltipClass();
        this.headerIconTooltip.tooltipClass = toolClass;
      }
    }
  }

    @HostListener('touchend', ['$event'])
    ontouchend(event) {
      event.preventDefault();
      this.actionIconTouchEnd(event);

      this.headerIconTooltip.hide();
      this.headerIconTooltip.disabled = true;
      // this.changeDetectorRef.detectChanges();
    }

    actionIconTouchEnd(event) {

      clearTimeout(this.actionIconTouchTimeout);
      if (this.headerIconTooltipTouch === true) {

        this.headerIconTooltipTouch = false;
      } else {
        this.clickOnIcon.emit(event);
      }
    }

    private showTooltip() {
        const toolClass = this.setTooltipClass();

        this.headerIconTooltip.tooltipClass = toolClass;
        this.headerIconTooltip.disabled = false;
        this.headerIconTooltip.show();
    }

  private setTooltipClass() {
    if (this.headerIconTooltip) {
      this.headerIconTooltip.tooltipClass = [];
    }

    const toolClassByPosition = this.utilityService.setTooltipClass(this.position.value);
    let toolClass: string[]  = [];
    for (let i of this.tooltipClass) {
      toolClass.push(i);
    }
    toolClass.push(toolClassByPosition);
    return toolClass;
  }

    ngOnChanges(changes: SimpleChanges): void {
      if (changes.tooltipPosition) {
        if (changes.tooltipPosition.currentValue !== changes.tooltipPosition.previousValue) {
          const toolClass = this.setTooltipClass();
          this.headerIconTooltip.tooltipClass = toolClass;
        }
      }
    }

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
      }
    }

    ngAfterViewInit() {
      if (isPlatformBrowser(this.platformId)) {
        if (this.svgInner) {
          // this.iconPathElement.nativeElement.innerHTML = this.svgIcon;
          this.renderer2.setProperty(this.iconPathElement.nativeElement, 'innerHTML', this.svgIcon);
        }

        this.tempTooltipClass = this.tooltipClass;
      }
    }

    clickIcon(event) {
      // event.preventDefault();
      // event.stopPropagation();
      clearTimeout(this.tooltipShowTimeout);
      // if (!this.isTouchDevice) {


        this.clickOnIcon.emit(event);

      // }
    }
}
