import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-count-label',
    templateUrl: 'count-label.component.html'
})

export class CountLabelComponent implements OnInit {
    @Input() count: number;
    @Input() label: string;
    constructor() { }

    ngOnInit() { }
}
