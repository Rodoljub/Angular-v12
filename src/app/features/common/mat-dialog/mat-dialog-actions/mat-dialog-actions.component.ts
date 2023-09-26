import { Component, OnInit, Input, EventEmitter, Output, Inject, PLATFORM_ID } from '@angular/core';
import { config } from '../../../../../config/config';
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'app-mat-dialog-actions',
    templateUrl: './mat-dialog-actions.component.html'
})
export class MatDialogActionsComponent implements OnInit {
    @Input() isEdit = true;
    @Input() itemOwner = false;
    @Input() actionLabel: string;
    @Input() actionDisabled: boolean;
    cancelLabel = config.labels.dialogMenu.cancel;
    editLabel = config.labels.dialogMenu.edit;
    @Output() clickCancel = new EventEmitter();
    @Output() clickAction = new EventEmitter();
    @Output() clickEdit = new EventEmitter();

    mobileView = false;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            // let resizeEventWidth = document.scrollingElement.clientWidth;

            // if (resizeEventWidth < 480) {
            //     this.mobileView = true;
            // } else {
            //     this.mobileView = false;
            // }
        }
     }

    cancelClick() {
        this.clickCancel.emit();
    }

    actionClick() {
        this.clickAction.emit();
    }

    editClick() {
        this.clickEdit.emit();
    }
}
