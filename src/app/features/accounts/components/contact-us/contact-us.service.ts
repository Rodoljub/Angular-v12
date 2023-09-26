import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Injectable({providedIn: 'root'})
export class ContactService {

    userUri = `${environment.asURi}/api/auth`

    constructor(
        private httpClient: HttpClient
    ) { }

    validate(validateModel) {
        const validateContactUri = `${this.userUri}/validateContact/`;
        
        return this.httpClient.post(validateContactUri, validateModel)
                              .pipe();
    }

    sendContactMessage(contactMessage) {
        const contactMessageUri = `${this.userUri}/contactMessage`;

        return this.httpClient.post(contactMessageUri, contactMessage)
            .pipe();
    }
    
}