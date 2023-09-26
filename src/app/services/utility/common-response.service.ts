import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UtilityService } from './utility.service';
import { EventService } from './event.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { SnackBarService } from '../../features/common/snack-bar/snack-bar.service';
import { MappingItem } from '../../shared/mappingItem';
import { ResponseError } from '../../shared/responseError';

@Injectable({
    providedIn: 'root',
  })
export class CommonResponseService {

    constructor(
        private snackBarService: SnackBarService,
        private utilityService: UtilityService,
        private eventService: EventService,
        private router: Router
    ) { }

    fromBody(res: any) {

        if (res.text().trim().length === 0) {
            return {};
        } else {
            let body = res.json();

            if (body.data) {
                return body.data;
            } else {
                return body || {};
            }
        }
    }

    fromQuery(res: Response) {
        let query = res.toString();
        return query;
    }

    handleError(error: any) {
        if (error instanceof HttpErrorResponse) {
           return throwError(error.error)
        }

        return error;
    }
}

