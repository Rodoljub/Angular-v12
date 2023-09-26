import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OidcService } from 'src/app/features/accounts/services/oidc.service';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { ItemViewModel } from '../ItemViewModel';

@Component({
    selector: 'app-item-media',
    templateUrl: './item-media.component.html',
    styleUrls: ['item-media.component.scss']
})

export class ItemMediaComponent implements OnInit {
    appItem = false;
    userAuthenticated: boolean = undefined;
    mobileView = false;
    typeOfItemsList = '';
    item: ItemViewModel;
    showDetails = true;
    clientScreenWide = false;



    constructor(
        private route: ActivatedRoute,
        private utilityService: UtilityService,
        private oidcService: OidcService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        this.oidcService.loginChanged.subscribe(userAuthenticated => {
            this.userAuthenticated = userAuthenticated;
        })
    }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.oidcService.isAuthenticated().then(userAuthenticated => {

                this.userAuthenticated = userAuthenticated;
            })

            this.route.data
            // .toPromise()
            .subscribe(
                // .then(
                response => {
                    if (response.seo) {
                            // this.location.replaceState('/');
                            this.item = this.utilityService.mapJsonObjectToObject<ItemViewModel>(response.seo);
                            this.appItem = true;
                            // let items = [];
                            // items.push(item);
                            // let itemsModalListModel = new ItemsModalListModel(0, items);
                            // this.setItemModal(itemsModalListModel);
                            // let progressSpinnerModel = new ProgressSpinnerModel(false, false);
                            // this.eventService.setMainProgressSpinner(progressSpinnerModel);

                    }
                },
            );
        }
    }

    clickCloseItem() {}

}
