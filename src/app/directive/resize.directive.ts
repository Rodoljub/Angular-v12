import {
  Directive, Inject, ElementRef, Input,
  HostListener, Renderer2, OnChanges, OnInit, PLATFORM_ID, AfterViewInit, AfterContentInit
} from '@angular/core';
// import * as _ from  'lodash';
import { isPlatformBrowser, isPlatformServer } from '../../../node_modules/@angular/common';

@Directive({
  selector: '[appResize]'
})
export class ResizeDirective implements AfterViewInit {

  clientHeight: number
  @Input() headerHeight: number;
  @Input() footerHeight: number;

  constructor(
    private el: ElementRef,
    private renderer2: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (isPlatformBrowser(this.platformId)) {
      this.setResizeHeightOfMainRouter();
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.setResizeHeightOfMainRouter();
    }
  }

  private setResizeHeightOfMainRouter() {
    const clientHeight = document.scrollingElement.clientHeight;

    const headerElement = document.getElementById('header');

    if (headerElement) {
      this.headerHeight = headerElement.clientHeight;
    } else {
      this.headerHeight = 0;
    }

    const footerElement = document.getElementById('footer-toolbar');

    if (footerElement) {
      this.footerHeight = footerElement.clientHeight;
    } else {
      this.footerHeight = 0;
    }

    this.resizeHeightOfMainRouter(clientHeight, this.headerHeight, this.footerHeight);
  }

  private resizeHeightOfMainRouter(clientHeight, headerHeight, footerHeight) {
    const mainOut = document.getElementById('router-outlet');
    if (mainOut) {
      this.renderer2.setStyle(
        mainOut, 'min-height', clientHeight - headerHeight - footerHeight  + 'px'
      )
    }
  }
}
