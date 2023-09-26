import { Directive, HostListener, ElementRef, Renderer2 } from '@angular/core';

@Directive({ selector: '[app-items-modal-list]' })
export class ItemsModalListDirective {

    touchStartX: number;
    touchStartY: number;
    touchMoveStartX: number;
    touchMoveStartY: number;
    touchMoveX: number;
    touchMoveY: number;
    isFirstMove = true;

    clientWidth: number;

    constructor(
        private el: ElementRef,
        private renderer2: Renderer2
    ) {
        this.clientWidth = document.body.clientWidth;
    }

    @HostListener('touchstart', ['$event'])
    onTouchStart(event) {
        this.touchStartX = event.targetTouches[0].clientX;
        this.touchStartY = event.targetTouches[0].clientY;
        this.touchMoveX = this.touchStartX;
    }

    @HostListener('touchmove', ['$event'])
    onTouchMove(event) {
        let touchMoveX = event.targetTouches[0].clientX;
        let touchMoveY = event.targetTouches[0].clientY;

        // if (this.isFirstMove) {

        //     this.touchMoveStartX = touchMoveX;
        //     this.touchMoveStartY = touchMoveY;
        //     this.isFirstMove = false;

        // }


        let movementX = touchMoveX - this.touchMoveX;

        this.touchMoveX = touchMoveX;
        this.touchMoveY = touchMoveY;
        // if (Math.abs(this.touchStartX - this.touchMoveStartX) < Math.abs(this.touchStartY - this.touchMoveStartY)) {

            // event.preventDefault();
        // } else {
            // event.stopPropagation()
            // setTimeout(() => {
                this.moveItems(movementX)
            // }, 0)

        // }
    }

    @HostListener('touchend', ['$event'])
    onTouchEnd(event) {}

    moveItems(movementX: Number) {
        const elementBound = this.el.nativeElement.getBoundingClientRect();
        const elementBoundLeft = elementBound.left;
        const elementWidth = elementBound.width;

        let translate = movementX;

        if (elementWidth > this.clientWidth) {
                if (elementBoundLeft + movementX > 0) {
                    translate = 0;
                } else if (elementBoundLeft + movementX < -elementWidth + this.clientWidth) {
                    translate = elementWidth + this.clientWidth;
                } else {
                    translate = elementBoundLeft + translate;
                }

                this.renderer2.setStyle(this.el.nativeElement, 'transform', 'translateX(' + translate + 'px)');
        }
    }
}
