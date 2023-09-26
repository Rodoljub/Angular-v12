import { Injectable } from '@angular/core';
import { CommonResponseService } from '../utility/common-response.service';
import { environment } from '../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { TagsModel } from '../../features/items/item/item-tags/TagsModel';
import { SaveSearchResultModel } from '../../features/search/SaveSearchResultModel';
import { SaveSearchModel } from '../../features/search/SaveSearchModel';

@Injectable({
  providedIn: 'root'
})
export class SearchApiService {

  itemsUrl = `${environment.rsURi}/api/search`

  constructor(
    private httpClient: HttpClient,
    private commonResponseService: CommonResponseService,
  ) { }


  searchTags(name: string, selectedTags: string[]): Observable<TagsModel[]> {
      let selectedTagsString = '';
      if (selectedTags.length === 0) {
        selectedTagsString = encodeURI('null')
      } else {
        selectedTagsString = encodeURI(selectedTags.toString());
      }

      const url = `${this.itemsUrl}/tags?query=${name}&selectedTags=${selectedTagsString}&skip=${0}`
      return this.httpClient.get<TagsModel[]>(url)
      .pipe(
        // tap((response: string[]) => {

        //   // response.results = response.results
        //     // .map(user => new User(user.id, user.name))
        //     // Not filtering in the server since in-memory-web-api has somewhat restricted api
        //     // .filter(user => user.name.includes(filter.name))

        //   return response;
        // })
      );
  }


  getSearch(query: string, skip: number): Promise<any> {

    const encodedUrI = encodeURI(query).replace(/\#/g, '%23');
    const url = `${this.itemsUrl}?query=${encodedUrI}&skip=${skip}`;

    return this.httpClient.get(url)
      .toPromise()
      .then(this.commonResponseService.fromBody)
  }

  saveSearch(saveSearchModel: SaveSearchModel): Observable<SaveSearchResultModel> {
    // saveSearchModel.SearchQuery = encodeURI(saveSearchModel.SearchQuery).replace(/\#/g, '%23');
    const url = `${this.itemsUrl}/SaveSearch`;
    return this.httpClient.post<SaveSearchResultModel>(url, saveSearchModel)
      .pipe(
        catchError(err => {
          return throwError(err)
        })
      );
  }

  updateSearch(saveSearchModel: SaveSearchResultModel): Observable<SaveSearchResultModel> {
    // saveSearchModel.SearchQuery = encodeURI(saveSearchModel.SearchQuery).replace(/\#/g, '%23');
    const url = `${this.itemsUrl}/UpdateSaveSearch`;
    return this.httpClient.post<SaveSearchResultModel>(url, saveSearchModel)
      .pipe()
  }

  deleteSavedSearchResults(collectionData: string[]): Observable<string[]> {
    const url = `${this.itemsUrl}/DeleteSaveSearch`;
    return this.httpClient.post<string[]>(url, collectionData)
      .pipe()
  }

  getSavedSearch(): Observable<SaveSearchResultModel[]> {
    const url = `${this.itemsUrl}/SaveSearch`;

    return this.httpClient.get<SaveSearchResultModel[]>(url)
      .pipe();
  }

  getSavedSearchInMemory(): Observable<any> {
    const url = 'http://192.168.1.103/api/savedSearch';

    return this.httpClient.get(url)
      .pipe(
        // tap(resp =>),
        // map(),
      )
  }
  // ?SaveSearchModel=${saveSearchModel}

  // saveSearch(query: string): Promise<any> {

  //   let encodedUrI = encodeURI(query).replace(/\#/g, '%23');
  //   let url = `${this.itemsUrl}/SaveSearch?query=${encodedUrI}`;

  //   return this.http.post(url)
  //     .toPromise()
  //     .then(this.commonResponseService.fromBody)
  // }
}
