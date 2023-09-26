import { Directive, Inject,  ElementRef, OnInit, PLATFORM_ID,
    AfterViewInit, Renderer2, OnDestroy, EventEmitter, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { EventService } from '../services/utility/event.service';

@Directive({
    selector: '[appSideNavContainer]'
})

export class SideNavContainerDirective implements OnInit, OnDestroy {

    headerHeightSubscription: Subscription;

    @Output() changeHeaderHeight = new EventEmitter<number>();

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private renderer2: Renderer2,
        private el: ElementRef,
        private eventService: EventService
    ) { }


    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.headerHeightSubscription = this.eventService.getHeaderHeight()
                .subscribe(data => {
                    this.changeHeaderHeight.emit(data);
                    // this.renderer2.setStyle(this.el.nativeElement, 'padding-top', data + 'px');
                })
        }
    }

    ngOnDestroy() {
        if (this.headerHeightSubscription) {
            this.headerHeightSubscription.unsubscribe();
        }
    }
}
