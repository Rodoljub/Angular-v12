import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { CreateUserModel } from '../models/CreateUserModel';
import { NewPasswordModel } from '../models/NewPasswordModel';
import { EmailModel } from '../models/EmailModel';
import { UserProfileModel } from '../models/UserProfileModel';
import { UtilityService } from '../../../services/utility/utility.service';
import { CommonResponseService } from '../../../services/utility/common-response.service';

@Injectable({
    providedIn: 'root',
  })
export class UserService {

    userUri = `${environment.asURi}/api/auth`
    profileUri = `${environment.asURi}/api/profile`

    public userId: string;

    constructor(
        private httpClient: HttpClient,
        private utilityService: UtilityService,
        private commonResponseService: CommonResponseService,
    ) {}

    userDataValidation(validateUser: CreateUserModel) {
        const regUserUri = `${this.userUri}/validateregister/`
        const headers = new HttpHeaders({
             'Content-Type': 'application/json' ,  'Accept': 'application/json'
        });

        return this.httpClient.post(regUserUri, validateUser, {headers: headers})
            .pipe(catchError(err => this.commonResponseService.handleError(err)))
    }

    registerUser(register: any) {

        const regUserUri = `${this.userUri}/register/`;

        const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        })

        let request = this.utilityService.urlEncode(register);

        return this.httpClient.post(regUserUri, request,
                {headers: headers}
            )
            .pipe(catchError(err => this.commonResponseService.handleError(err)))

    }

    reSendConfirmationEmail(email: any): Promise<any> {
        const sendEmailUrl = `${this.userUri}/ReSendConfirmationEmail/`
        const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        });

        let request = this.utilityService.urlEncode(email);

        return this.httpClient.post(sendEmailUrl, request,
                {headers: headers}
            )
            .toPromise()
    }

    resetPassword(newPassword: NewPasswordModel, reseturl) {
        //    let newPassUri = `${this.userUri}/newpassword/`
        const headers = new HttpHeaders({
                'Content-Type': 'application/json', 'Accept': 'application/json'
        });

        const reseturlDecodeUri = decodeURIComponent(reseturl);

        return this.httpClient.post(reseturlDecodeUri, newPassword,
                {headers: headers}
            )
            .toPromise()
            .then()
    }

    validateDataEmail(validateEmail: EmailModel) {
        const sendEmailUrl = `${this.userUri}/validateEmail/`
        const headers = new HttpHeaders({
            'Content-Type': 'application/json', 'Accept': 'application/json'
        });

        return this.httpClient.post(sendEmailUrl, validateEmail,
                {headers: headers}
            )
            .pipe()
    }

    sendReseetPasswordEmail(email: any): Promise<any> {
        const sendEmailUrl = `${this.userUri}/sendresetpasswordemail/`
        const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        });

        const request = this.utilityService.urlEncode(email);

        return this.httpClient.post(sendEmailUrl, request,
            {headers: headers}
            )
            .toPromise()
            .then()

    }

    changePassword(changePassword) {
        const changePassUrl = `${this.userUri}/changepassword/`

        return this.httpClient.post(changePassUrl, changePassword)
            .toPromise()
            .then()
    }

    confirmEmail(confirmUrl): Promise<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json', 'Accept': 'application/json'
        });

        const confirmUrlDecodeUri = decodeURIComponent(confirmUrl);

        return this.httpClient.post(confirmUrlDecodeUri, {},
                {
                    headers: headers,
                    observe: 'response'
                }
            )
            .toPromise()
            .then()
    }

    resetPasswordEmail(reseturl) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json', 'Accept': 'application/json'
        });

        return this.httpClient.post(reseturl, {},
                {headers: headers}
            )
            .toPromise()
            // .then(this.commonResponseService.fromQuery)
    }

}
