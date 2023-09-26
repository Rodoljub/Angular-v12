import { Component, OnInit, Renderer2, Input, Output, EventEmitter, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { UtilityService } from '../../../services/utility/utility.service';
import { UserProfileModel } from '../../accounts/models/UserProfileModel';

@Component({
    selector: 'modal-menu',
    templateUrl: 'modal-menu.component.html'
})

export class ModalMenuComponent implements OnInit {
    @Input() userAuthenticated: boolean;
    @Output() clickOnClose = new EventEmitter();

    constructor(
        private renderer2: Renderer2,
        private utilityService: UtilityService,
        @Inject(PLATFORM_ID) private platformId: Object,
    ) { }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.renderer2.addClass(document.body, 'noScroll');
        }
     }


    closeMenu() {
        this.renderer2.removeClass(document.body, 'noScroll');
        this.clickOnClose.emit();
        this.utilityService.removeFixedScrollPosition(this.renderer2);
    }
}
