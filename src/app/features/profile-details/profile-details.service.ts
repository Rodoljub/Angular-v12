import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CommonResponseService } from '../../services/utility/common-response.service';
import { Observable } from 'rxjs';
import { ProfileDetailsModel } from './ProfileDetailsModel';
import { catchError } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class ProfileDetailsService {
    profileUrl = `${environment.rsURi}/api/profile`
    constructor(
        private httpClient: HttpClient,
        private commonResponseService: CommonResponseService
    ) { }

    getProfile(): Observable<ProfileDetailsModel> {

        return this.httpClientGet(this.profileUrl)
    }

    getDetailsBySegment(urlSegment: string): Observable<ProfileDetailsModel> {
        let url = `${this.profileUrl}/userProfile/urlSegment/${urlSegment}`;
        return this.httpClientGet(url)
        .pipe()
    }

    getDetailsByEmail(email: string): Observable<ProfileDetailsModel> {

        let url = `${this.profileUrl}/userProfile/email/${email}`;
        return this.httpClientGet(url)
    }

    private setHttpOptions() {
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
    }

    private httpClientGet(url: string): Observable<ProfileDetailsModel> {
        return this.httpClient.get<ProfileDetailsModel>(url)
            .pipe();
    }
}
