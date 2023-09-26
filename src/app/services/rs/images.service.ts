import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CommonResponseService } from '../utility/common-response.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  constructor(
    private httpClient: HttpClient,
    private commonResponseService: CommonResponseService
  ) { }

  getAndSaveImage(imagePath: string, imageReduced: boolean, imageWidth: number): Promise<any> {
    // let fileId = imagePath.split('/').reverse()[0].split('.')[0];
    if (imagePath) {
      const url = `${environment.appDomain}/${'api/file/save'}`;
      console.log('service url:' + url)
      const headers = new HttpHeaders({
        'Content-Type': 'application/json', 'Accept': 'application/json'
      });

      return this.httpClient.post(url, {imagePath, imageReduced, imageWidth},
          {headers: headers}
        )
        .toPromise()
        .then(this.commonResponseService.fromBody)
    }

  }

  saveImage(itemFile, itemId, type): Promise<any> {
    const url = `${environment.appDomain}/${'api/file'}`;

    let headers = new HttpHeaders({
      'Content-Type': 'application/json', 'Accept': 'application/json'
    });
    let radi = 'radi'
    // console.log(JSON.stringify(userImage))
    return this.httpClient.post(url, {itemFile, itemId, type}, {headers: headers})
    .toPromise()
    .then()
    .catch()
  }

  getDefaultProfileImage() {
    return '/assets/images/profile-pic.jpg';
  }
}
