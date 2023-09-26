import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, retry, debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MappingItem } from '../shared/mappingItem';
import { ResponseError } from '../shared/responseError';
import { SnackBarService } from '../features/common/snack-bar/snack-bar.service';



@Injectable({
  providedIn: 'root'
})
export class ApiHandleErrorInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private snackBarService: SnackBarService
  ) { }


  intercept(request: HttpRequest<any>, next: HttpHandler): any {
    return next.handle(request).pipe(
      tap(
        event => { },
        error => {
            if (error instanceof HttpErrorResponse) {
                switch (error.status) {
                    case 0:
                        this.snackBarService.popMessageError('Something went wrong.')
                    break;
                    case 401:
                        this.router.navigate([{outlets: {auth: 'accounts/login'}}],
                        { queryParams: { returnUrl: this.router.url }})
                    break;
                    default:
                    break;
                }
                // if (error.error instanceof ErrorEvent) {
                //     // A client-side or network error occurred. Handle it accordingly.
                //     console.error('An error occurred:', error.error.message);
                // } else {
                //     // The backend returned an unsuccessful response code.
                //     // The response body may contain clues as to what went wrong.
                //     console.error(
                //         `Backend returned code ${error.status}, ` +
                //         `body was: ${error.error}`);
                // }
            }
        }
      ));

    }


    dispalyErrorMessages(respError: any, component: any, errorMapping: Array<MappingItem> = [], maxNumberOfMessagesToDisplay = 10) {
        let errorMessage = '';

        let maxNumberOfMessages = maxNumberOfMessagesToDisplay;
        let currentNumberOfMessages = 0;

        let responseError: ResponseError = respError as ResponseError;

        if (responseError.errors) {

            responseError.errors.forEach((message, propNameIndex) => {

                if (propNameIndex < maxNumberOfMessages) {
                    errorMessage += message.description ;
                }

                if (errorMapping.length > 0) {
                    let mapItem = errorMapping.find(item => item.mapFrom === message.code);

                    if (mapItem != null && mapItem.mapTo != null) {

                        component[mapItem.mapTo] = 'error';
                    }
                }
            })

        } else {

            let errorObjectPropertyNames = Object.getOwnPropertyNames(respError);

            errorObjectPropertyNames.forEach((propName, propNameIndex) => {
                let errorObjectProp = Object.getOwnPropertyDescriptor(respError, propName);

                if (errorObjectProp.enumerable) {
                    if (errorObjectProp.value && errorObjectProp.value.length > 0
                         && typeof errorObjectProp.value !== 'string') {

                        errorObjectProp.value.forEach((message, index) => {
                            if (currentNumberOfMessages < maxNumberOfMessages) {

                                errorMessage += message;
                                currentNumberOfMessages = currentNumberOfMessages + 1;
                            }
                        });

                        let errorClassPropertyName = 'ErrorClass'
                        // + this.utilityService.capitalize(propName);

                        if (component[errorClassPropertyName] !== undefined) {

                            component[errorClassPropertyName] = 'error';
                        }
                    }
                }
            });
        }

        if (errorMessage === '') {
            if (errorMapping.length > 0) {
                let errorExist = errorMapping.find(e => e.mapFrom === respError.Message)

                if (errorExist) {
                    errorMessage = errorExist.mapTo;
                }
            }

            if (errorMessage === '') {
                errorMessage = respError.Message;
            }

        }

        this.snackBarService.popMessageError(errorMessage);

    }

}
