import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CommonResponseService } from '../utility/common-response.service';
import { HttpClient } from '@angular/common/http';
import { ReportedContentReasonModel } from '../../features/models/ReportedContentReasonModel';
import { ReportedContentModel } from '../../features/models/ReportedContentModel';

@Injectable({
  providedIn: 'root'
})
export class ReportedContentService {

  itemUri = `${environment.rsURi}/api/ReportedcontentReasons`

  constructor(
    private httpClient: HttpClient,
    private commonResponseService: CommonResponseService,
  ) { }


  getReportedContentReasons(): Promise<any> {
    const url = `${this.itemUri}`

    return this.httpClient.get(url)
      .toPromise()
      .then(response => <ReportedContentReasonModel[]>response)
  }

  setReportedContent(reportedContent: ReportedContentModel): Promise<any> {
    const url = `${this.itemUri}`

    return this.httpClient.post(url, reportedContent)
      .toPromise()
      .then(this.commonResponseService.fromBody)
  }
}
