import { Component, OnInit, Input, ViewChild, HostListener,
    ChangeDetectorRef, Inject, PLATFORM_ID, Output, EventEmitter, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { UtilityService } from '../../../../services/utility/utility.service';
import { config } from '../../../../../config/config';
import { MatTooltip, TooltipPosition } from '@angular/material/tooltip';

@Component({
    selector: 'app-button-mat-fab-icon',
    templateUrl: './button-mat-fab-icon.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonMatFabIconComponent implements OnInit, OnChanges {

    @Input() isButtonActiveInactive = true;
    @Input() buttonActive = false;
    @Input() buttonClass: string;
    @Input() buttonInactiveClass = '-inactive';
    @Input() buttonTooltip: string;
    @Input() buttonTooltipClass: string[] = [];
    @Input() buttonTooltipPosition: TooltipPosition;
    @Input() svgIcon: string;

    loaded = false;

    tooltipShowDelay = config.tooltips.showDelay;


    @ViewChild('buttonTooltipEl', {static: false}) buttonTooltipEl: MatTooltip;
    actionIconTouchTimeout: NodeJS.Timer;
    buttonIconTooltipTouch: boolean;

    @Output() clickOnbutton = new EventEmitter();

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

        this.loaded = true;
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

    @HostListener('touchmove')
    ontouchmove() {
      clearTimeout(this.actionIconTouchTimeout);
    }

    @HostListener('touchend')
    ontouchend() {
      this.actionIconTouchEnd();

      this.buttonTooltipEl.hide(500);
      this.changeDetectorRef.detectChanges();
    }

    actionIconTouchEnd() {

      clearTimeout(this.actionIconTouchTimeout);
      if (this.buttonIconTooltipTouch === true) {

        this.buttonIconTooltipTouch = false;
      } else {
        this.clickOnbutton.emit();
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
