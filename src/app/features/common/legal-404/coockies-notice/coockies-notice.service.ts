import { Injectable, ViewContainerRef } from '@angular/core';
import { CoockiesNoticeComponent } from './coockies-notice.component';

@Injectable({providedIn: 'root'})
export class CoockiesNoticeService {

    constructor(
        // public viewContainerRef: ViewContainerRef
    ) { }

    setCoockiesNotice() {
        // this.viewContainerRef.createComponent<CoockiesNoticeComponent>()
    }
}
