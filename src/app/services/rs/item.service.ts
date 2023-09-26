import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CommonResponseService } from '../utility/common-response.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '../../../../node_modules/@angular/common/http';
import { Observable, throwError } from '../../../../node_modules/rxjs';
import { UploadItemModel } from '../../features/upload/models/UploadItemModel';
import { ItemViewModel } from '../../features/items/item/ItemViewModel';
import { AnalyzingImageModel } from '../../features/upload/models/AnalyzingImageModel';
import { CreateItemModel } from 'src/app/features/upload/models/CreateItemModel';


@Injectable({providedIn: 'root'})

export class ItemService {


  itemsUrl = `${environment.rsURi}/api/items`
  apiUrl = `${environment.rsURi}/api`
  favouritesUrl = `${environment.rsURi}/api/favourites`

  constructor(
    private httpClient: HttpClient,
    private commonResponseService: CommonResponseService
  ) { }

  createItem(item: CreateItemModel): Promise<any> {
    const url = `${this.itemsUrl}`
    let input = new FormData();

    input.append('file', item.File)
    input.append('description', item.Description)

    return this.httpClient.post(url, input)
      .toPromise()
      .then()
  }

  updateItem(uploadItem: UploadItemModel): Promise<any> {

    const url = `${this.itemsUrl}`
    let input = new FormData();

    if (uploadItem.Title !== undefined) {
      input.append('title', uploadItem.Title);
    }

    for (let tag of uploadItem.Tags) {
      input.append('tags', tag)
    }
    if (uploadItem.Description !== undefined) {
      input.append('description', uploadItem.Description)
    }

    input.append('itemId', uploadItem.ItemId)

    return this.httpClient.put(url, input)
      .toPromise()
      .then(this.commonResponseService.fromBody)

  }

  getMostFavouriteItem(): Promise<any> {
    const url = `${this.favouritesUrl}/mostFavourite`;

    return this.httpClient.get(url)
      .toPromise()
      .then(this.commonResponseService.fromBody)
  }

  getItem(id: string, isBrowser: boolean): Promise<any> {
    const url = `${this.itemsUrl}/${id}`;

    let headers = new HttpHeaders({});

    return this.httpClient.get(url)
      .toPromise()
  }


  getItemHttpClient(id: string): Observable<ItemViewModel> {
    const url = `${this.itemsUrl}/${id}`;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    return this.httpClient.get<ItemViewModel>(url, httpOptions)
    //   catchError(this.handleHttpError)
    // )

  }

  private handleHttpError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };

  deleteItem(id): Promise<any> {

    const url = `${this.itemsUrl}/${id}`

    return this.httpClient.delete(url)
      .toPromise()
      .then()
  }

  getRelated(id, skip: number): Promise<any> {

    const url = `${this.itemsUrl}/${id}/related?skip=${skip}`

    return this.httpClient.get(url)
      .toPromise()
      .then(this.commonResponseService.fromBody)
  }


  getAnayzingImages(): Observable<AnalyzingImageModel[]> {
    const url = `${this.itemsUrl}/analyzingImages`;

    return this.httpClient.get<AnalyzingImageModel[]>(url)
  }
}
