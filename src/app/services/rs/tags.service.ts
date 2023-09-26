import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CommonResponseService } from '../utility/common-response.service';
import { HttpClient } from '@angular/common/http';
import { TagsModel } from '../../features/items/item/item-tags/TagsModel';

@Injectable({
  providedIn: 'root',
})
export class TagsService {

  itemUri = `${environment.rsURi}/api/Tags`

  constructor(
    private httpClient: HttpClient,
    private commonResponseService: CommonResponseService,
  ) { }

  getTags(): Promise<any> {
    const url = `${this.itemUri}`

    return this.httpClient.get(url)
      .toPromise()
      .then(response => <TagsModel[]>response)
  }
}

