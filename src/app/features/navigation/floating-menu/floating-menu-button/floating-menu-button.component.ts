import { Component, OnInit, Input, ViewChild, HostListener,
    ChangeDetectorRef, Inject, PLATFORM_ID, Output, EventEmitter, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { UtilityService } from '../../../../services/utility/utility.service';
import { config } from '../../../../../config/config';
import { MatTooltip, TooltipPosition } from '@angular/material/tooltip';

@Component({
    selector: 'app-floating-menu-button',
    templateUrl: './floating-menu-button.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FloatingMenuButtonComponent implements OnInit, OnChanges {

    @Input() isButtonActiveInactive = true;
    @Input() buttonActive: boolean;
    @Input() buttonClass: string;
    @Input() buttonInactiveClass = '-inactive';
    @Input() buttonTooltip: string;
    @Input() buttonTooltipClass: string[] = [];
    @Input() buttonTooltipPosition: TooltipPosition;
    @Input() svgIcon: string;

    tooltipShowDelay = config.tooltips.showDelay;


    @ViewChild('buttonTooltipEl', {static: false}) buttonTooltipEl: MatTooltip;
    actionIconTouchTimeout: NodeJS.Timer;
    buttonIconTooltipTouch: boolean;

    @Output() clickOnbutton = new EventEmitter();
    @Output() showMenuButton = new EventEmitter<string>();
    touchStartX: any;
    isTouchMove: boolean;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        @Inject(PLATFORM_ID) private platformId: Object,
        private utilityService: UtilityService
    ) { }

    ngOnInit(): void {
      if (isPlatformBrowser(this.platformId)) {
        if (this.buttonActive) {
          this.buttonInactiveClass = '';
        } else {
          this.buttonInactiveClass = '-inactive';
        }
      }
    }

    ngOnChanges(changes: SimpleChanges) {
      if (this.isButtonActiveInactive) {
        if (changes.buttonActive) {
          if (changes.buttonActive.currentValue) {
              this.buttonInactiveClass = '';
              this.tooltipShowDelay = 0;
              this.changeDetectorRef.detectChanges();
              this.showTooltip();
              this.changeDetectorRef.detectChanges();

              setTimeout(() => {
                  this.buttonTooltipEl.hide(500);
                  this.tooltipShowDelay = config.tooltips.showDelay;
              }, 500)
          } else {
            this.buttonInactiveClass = '-inactive';
          }
        }
      }
    }

    @HostListener('touchstart', ['$event'])
    ontouchstart(event) {
      this.touchStartX = event.touches[0].clientX;
      event.preventDefault();
      this.actionIconTouchStart(event);
    }

    actionIconTouchStart(event) {
      this.actionIconTouchTimeout = setTimeout(() => {
        this.buttonIconTooltipTouch = true;
        this.showTooltip();
        this.changeDetectorRef.detectChanges();
      }, 500);
    }

    @HostListener('touchmove', ['$event'])
    ontouchmove(event) {
        const touchMoveX = event.touches[0].clientX;
        if (touchMoveX + 4 > this.touchStartX) {
            this.showMenuButton.emit('out');
        }
        if (touchMoveX < this.touchStartX) {
            this.showMenuButton.emit('in');
        }
        this.isTouchMove = true;
        clearTimeout(this.actionIconTouchTimeout);
    }

    @HostListener('touchend')
    ontouchend() {
      event.preventDefault();
      this.actionIconTouchEnd();
    this.isTouchMove = false;
      this.buttonTooltipEl.hide(500);
      this.changeDetectorRef.detectChanges();
    }

    actionIconTouchEnd() {

      clearTimeout(this.actionIconTouchTimeout);
      if (this.buttonIconTooltipTouch === true) {

        this.buttonIconTooltipTouch = false;
      } else {
          if (!this.isTouchMove) {
            this.clickOnbutton.emit();
          }

      }
    }

    doSearch() {
        this.clickOnbutton.emit();
    }

    private showTooltip() {
        const toolClass = this.utilityService.setTooltipClass(this.buttonTooltipPosition);
        if (this.buttonTooltipClass.every(i => i !== toolClass)) {
          this.buttonTooltipClass.push(toolClass);
        }
        this.buttonTooltipEl.tooltipClass = this.buttonTooltipClass;
        this.buttonTooltipEl.show();
    }
}

