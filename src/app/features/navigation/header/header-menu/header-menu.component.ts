import { Component, OnInit, ViewChild, Input, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { UserProfileModel } from '../../../accounts/models/UserProfileModel';
import { styleClassConfig } from '../../../../../config/styleClassConfig';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
    selector: 'app-header-menu',
    templateUrl: './header-menu.component.html',
    styleUrls: ['header-menu.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class HeaderMenuComponent implements OnInit {
    @Input() userAuthenticated: boolean;

    @ViewChild('menuTrigger', {static: false}) menuTrigger: MatMenuTrigger;

    accentColorClass = '';

    constructor() { }

    ngOnInit() { }

    onMenuOpened() {
        this.accentColorClass = styleClassConfig.accentColor;
    }

    onMenuClosed() {
        this.accentColorClass = '';
    }

    //   changeTheme(theme: string) {
    //     this.eventService.setTheme(theme);
    //   }
}
