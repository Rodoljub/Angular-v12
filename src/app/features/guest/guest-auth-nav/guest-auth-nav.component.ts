import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-guest-auth-nav',
    templateUrl: 'guest-auth-nav.component.html',
    styleUrls: ['guest-auth-nav.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class GuestAuthNavComponent implements OnInit {
    constructor() { }

    ngOnInit() { }
}
