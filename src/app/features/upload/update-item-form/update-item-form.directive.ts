import { Directive, DoCheck, ElementRef } from '@angular/core';

@Directive({ selector: '[appUpdateItemForm]' })
export class UpdateItemFormDirective implements DoCheck {
    constructor(
        private elRef: ElementRef
    ) { }

    ngDoCheck(): void {
        // if (this.elRef) {
        //     console.log('anything')
        // }
    }
}
