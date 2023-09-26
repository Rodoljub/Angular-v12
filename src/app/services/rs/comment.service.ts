import { Injectable } from '@angular/core';
import { CommonResponseService } from '../utility/common-response.service';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CommentModel } from '../../features/comments/CommentModel';
import { CommentViewModel } from '../../features/comments/CommentViewModel';

@Injectable({
  providedIn: 'root',
})
export class CommentService {

  apiUrl = `${environment.rsURi}/api`


  constructor(
    private httpClient: HttpClient,
    private commonResponseService: CommonResponseService
  ) { }

  // getCommentsCount(itemId) {
  //   let url = `${this.apiUrl}/Comments/${itemId}/count`
  //   return this.http.get(url)
  //   .toPromise()
  //   .then(this.commonResponseService.fromBody)
  // }

  getComments(itemId: string, initialCommentsIds: string[], typeName: string, skip: number) {
    const url = `${this.apiUrl}/Comments/${itemId}?initialCommentsIds=${initialCommentsIds}&typeName=${typeName}&skip=${skip}`

    return this.httpClient.get(url)
          .toPromise()
  }

  addComment(comment: CommentModel): Promise<any> {
    const url = `${this.apiUrl}/Comments`
      return this.httpClient.post(url, comment)
          .toPromise()
          // .then(this.commonResponseService.fromBody)
  }

  updateComment(comment: CommentViewModel): Promise<any> {
    const url = `${this.apiUrl}/Comments/Update`;

    return this.httpClient.post(url, comment)
          .toPromise()
          // .then(this.commonResponseService.fromBody)
  }

  deleteComment(commentId: string): Promise<any> {
    const url = `${this.apiUrl}/Comments/${commentId}`
    return this.httpClient.delete(url)
          .toPromise()
          // .then(this.commonResponseService.fromBody)
  }
}
