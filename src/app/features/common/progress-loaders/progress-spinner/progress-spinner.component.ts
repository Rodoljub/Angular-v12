import { Component, OnInit, OnDestroy, Input, AfterViewInit, ViewChild, ElementRef,
  Renderer2, PLATFORM_ID, Inject, ChangeDetectionStrategy, ChangeDetectorRef, NgZone} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'app-progress-spinner',
  templateUrl: './progress-spinner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressSpinnerComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() detailProgressIcon = false;
  @Input() listProgressIcon = false;

  @ViewChild('spinnerCircle1', {static: false}) spinnerCircle1: ElementRef;
  @ViewChild('spinnerCircle2', {static: false}) spinnerCircle2: ElementRef;
  @ViewChild('svgElementSpinner', {static: false}) svgElementSpinner: ElementRef;
  fillColor = '#e91e63';

  platformBrowser = false;
  timeout: NodeJS.Timeout;


  constructor(
    private renderer2: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object,
    private changeDetectorRef: ChangeDetectorRef,
    private ngZone: NgZone
  ) { }

  ngOnInit() { }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.platformBrowser = true;
      this.changeDetectorRef.detectChanges();
      this.ngZone.runOutsideAngular(() => {

     this.timeout = setTimeout(() => {
        this.renderer2.removeAttribute(this.svgElementSpinner.nativeElement, 'visibility');
        this.renderer2.removeAttribute(this.spinnerCircle1.nativeElement, 'visibility');
        this.renderer2.removeAttribute(this.spinnerCircle2.nativeElement, 'visibility');
        if (!this.changeDetectorRef['destroyed']) {
          this.changeDetectorRef.detectChanges();
        }
      }, 1000)
    })
    }
  }

  ngOnDestroy() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }
}
