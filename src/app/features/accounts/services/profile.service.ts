import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { CommonResponseService } from '../../../services/utility/common-response.service';
import { UtilityService } from '../../../services/utility/utility.service';
import { UserProfileModel } from '../models/UserProfileModel';
import { UpdatedProfileModel } from '../models/UpdatedProfileModel';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
  })
export class ProfileService {

    profileUri = `${environment.rsURi}/api/profile`

    constructor(
        private httpClient: HttpClient,
        private commonResponseService: CommonResponseService,
        private utilityService: UtilityService
    ) { }

    updateProfile(updateProfile): Observable<UpdatedProfileModel> {

        const updateProfileUrl = `${this.profileUri}/update/`

        return this.httpClient
            .post<UpdatedProfileModel>(updateProfileUrl, updateProfile)
            .pipe(
                // catchError(this.commonResponseService.handleHttpError)
            )

    }

    getUserProfileByUrlSegment(urlSegment) {

        const url = `${this.profileUri}/userProfile/urlSegment/${urlSegment}`

        return this.httpClient
            .get(url,
                {observe: 'body'}
            )
            .pipe(
            //   catchError(this.commonResponseService.handleHttpError)
            )
            .toPromise()
    }

}
