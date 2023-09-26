import {HTTP_INTERCEPTORS} from '@angular/common/http';
import { AuthInterceptorService } from '../features/accounts/services/auth-interceptor';
import { ApiHandleErrorInterceptor } from './api-handle-error-inteceptor';

export const interceptorProviders =
   [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }
   //  ,
   //  { provide: HTTP_INTERCEPTORS, useClass: ApiHandleErrorInterceptor, multi: true }
   ];
