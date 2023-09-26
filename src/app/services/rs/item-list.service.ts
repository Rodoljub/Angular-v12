import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CommonResponseService } from '../utility/common-response.service';
import { config } from '../../../config/config';
import { ItemViewModel } from 'src/app/features/items/item/ItemViewModel';

@Injectable({
  providedIn: 'root'
})
export class ItemListService {



  latestItemsApi = `${environment.rsURi}/api/items/latest`;
  relatedItemsApi = `${environment.rsURi}/api/items/related`;
  searchItemsApi = `${environment.rsURi}/api/search`
  portfolioItemsApi = `${environment.rsURi}/api/items/portfolio`;
  favouritesItemsApi = `${environment.rsURi}/api/Favourites/list`;

  inMemoryListUrl = 'http://192.168.1.103/api/quantums'

  constructor(
    private httpClient: HttpClient,
    private commonResponseService: CommonResponseService,
  ) {}


  getItemsList(typeOfItemsList: string, skip: number, requestData?: string) {

    const requestUrl = this.setRequstUrl(typeOfItemsList, skip, requestData);

    return this.httpClient.get<ItemViewModel[]>(requestUrl)
            .toPromise()
            .then()
  }

  setRequstUrl(typeOfItemsList: string, skip: number, requestData?: string): string {
    switch (typeOfItemsList) {
      case config.itemsListsTypes.favourites:
        return `${this.favouritesItemsApi}?skip=${skip}`;
      case config.itemsListsTypes.latest:
        return `${this.latestItemsApi}?skip=${skip}`
      case config.itemsListsTypes.portfolio:
        return `${this.portfolioItemsApi}?skip=${skip}`
      case config.itemsListsTypes.portfolioAnonymous:
        return `${this.portfolioItemsApi}/${requestData}?skip=${skip}`
      case config.itemsListsTypes.related:
        return `${this.relatedItemsApi}/${requestData}?skip=${skip}`
      case config.itemsListsTypes.search:
        let encodedUrl = encodeURI(requestData).replace(/\#/g, '%23');
        return  `${this.searchItemsApi}?query=${encodedUrl}&skip=${skip}`;
      default:
        break;
    }
  }

  getInMemoryItems(skip: number) {
    return this.httpClient.get(this.inMemoryListUrl)
    .toPromise()
    .then(resp => resp)
  }

}
