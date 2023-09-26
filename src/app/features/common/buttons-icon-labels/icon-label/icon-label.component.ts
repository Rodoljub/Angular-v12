import { Component, OnInit, Input,
    Output, EventEmitter, ViewEncapsulation, ChangeDetectionStrategy, Inject, PLATFORM_ID, OnChanges, SimpleChanges } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { styleClassConfig } from '../../../../../config/styleClassConfig';

@Component({
    selector: 'app-icon-label',
    templateUrl: './icon-label.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class IconLabelComponent implements OnInit, OnChanges {
    @Input() svgIcon: string;
    @Input() label: string;
    @Input() active: boolean;

    @Output() clickOnButton = new EventEmitter();

    activeclass = '';

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.setActive();
        }
     }

    ngOnChanges(changes: SimpleChanges) {
        if (this.active !== undefined) {
            if (changes.active.currentValue !== changes.active.previousValue) {
                this.setActive();
            }
        }
    }

    clickButton() {
        this.clickOnButton.emit();
    }

    setActive() {
        if (this.active) {
            this.activeclass = styleClassConfig.accentColor;
        } else {
            this.activeclass = '';
        }
    }
}
