import { ResponseError } from '../../../shared/responseError';
import { ResponseMessage } from '../../../shared/responseMessage';

export class ResetPasswordErrors implements ResponseError {
    succeeded: boolean;
    errors: ResponseMessage[];
    Password: string[];
    ConfirmPassword: string[];


    /**
     *
     */
constructor() {};




    }
