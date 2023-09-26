import { ResponseError } from '../../../../shared/responseError';
import { ResponseMessage } from '../../../../shared/responseMessage';


export class ChangePasswordErrors implements ResponseError {
    succeeded: boolean;
    errors: ResponseMessage[];
    CurrentPassword: string[];
    Password: string[];
    ConfirmPassword: string[];


    /**
     *
     */
    constructor() { };


}
