import { ResponseError } from '../../../../shared/responseError';
import { ResponseMessage } from '../../../../shared/responseMessage';

export class CreateUserErrors implements ResponseError {
    succeeded: boolean;
    errors: ResponseMessage[];
    Name: string[];
    Email: string[];
    Password: string[];
    ConfirmPassword: string[];


    /**
     *
     */
constructor() {};






    }



