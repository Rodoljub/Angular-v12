import { Directive, HostListener, ElementRef, Renderer2, Input } from '@angular/core';

@Directive({
    selector: '[app-tag-hover]',
})
export class TagHoverDirective {
    @Input() disabled = false;

    timer: NodeJS.Timer;
    hoverClass = 'hover';

    constructor(
        private el: ElementRef,
        private renderer2: Renderer2
    ) { }

    @HostListener('mouseenter')
    onmouseenter() {
        this.addClass();
    }

    @HostListener('mouseleave')
    onmouseleave() {
        this.removeClass();
    }

    @HostListener('touchstart', ['$event'])
    onTouchStart(event) {
        this.addClass();
    }

    @HostListener('touchmove', ['$event'])
    onTouchMove(event) {
        clearTimeout(this.timer);
    }

    @HostListener('touchend', ['$event'])
    onTouchEnd(event) {
        this.timer = setTimeout(() => {
            this.removeClass();
            clearTimeout(this.timer);
        }, 200);
    }

    addClass() {
        if (!this.disabled) {
            this.renderer2.addClass(this.el.nativeElement, this.hoverClass);
        }
    }

    removeClass() {
        if (!this.disabled) {
            this.renderer2.removeClass(this.el.nativeElement, this.hoverClass);
        }
    }
}
