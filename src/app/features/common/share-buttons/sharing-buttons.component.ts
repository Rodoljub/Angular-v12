import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ItemViewModel } from '../../items/item/ItemViewModel';

@Component({
    selector: 'app-sharing-buttons',
    templateUrl: './sharing-buttons.component.html',
    styleUrls: ['sharing-buttons.component.scss']
})

export class SharingButtonsComponent implements OnInit {
    @Input() item: ItemViewModel;
    itemUrl = '';
    itemDescription = '';
    twitterAccount ='';
    shareLoaded = false;
    constructor() { }

    ngOnInit() {
        this.itemUrl = environment.appDomain + 
        // encodeURIComponent(
            '/(a:aa/' + this.item.Id +')'
            // );

        if (this.item.FileDetails && this.item.FileDetails.imageAnalysis) {
            const iA = this.item.FileDetails.imageAnalysis;
            if (iA && iA.description && iA.description.captions && iA.description.captions.length > 0) {
                this.itemDescription = iA.description.captions[0].text
            } else {
                if (iA.tags && iA.tags.length > 0) {
                    this.itemDescription = iA.tags.toString();
                }
            }
        }

        this.shareLoaded = true;
    }
}