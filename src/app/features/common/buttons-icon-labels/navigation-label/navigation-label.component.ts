import {
    Component, OnInit, Input, ViewEncapsulation, PLATFORM_ID,
    Inject, ChangeDetectionStrategy, OnChanges, SimpleChanges
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { styleClassConfig } from '../../../../../config/styleClassConfig';

@Component({
    selector: 'app-navigation-label',
    templateUrl: './navigation-label.component.html',
    styleUrls: ['navigation-label.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class NavigationLabelComponent implements OnInit, OnChanges {
    @Input() navigationLabel = '';
    @Input() active = false;
    @Input() disabled = false;

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
        if (this.active !== undefined && !!changes && !!changes.active) {
            if (changes.active.currentValue !== changes.active.previousValue) {
                this.setActive();
            }
        }
    }

    setActive() {
        if (this.active) {
            this.activeclass = styleClassConfig.accentColor;
        } else {
            this.activeclass = '';
        }
    }
}
