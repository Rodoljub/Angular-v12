import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-coockies-notice',
    templateUrl: 'coockies-notice.component.html',
    styleUrls: ['coockies-notice.component.scss']
})

export class CoockiesNoticeComponent implements OnInit {
    @Output() coockieNotice = new EventEmitter();
    constructor(
        private router: Router
    ) { }

    ngOnInit() { }

    clickOk() {
        this.coockieNotice.emit()
    }
    clickTerms() {this.router.navigate(['terms'])}
    clickPrivacyPolicy() {this.router.navigate(['policy'])}
}
