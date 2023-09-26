import { ResponseError } from '../../../shared/responseError';
import { ResponseMessage } from '../../../shared/responseMessage';


export class CreateUserErrors implements ResponseError {
    succeeded: boolean;
    errors: ResponseMessage[];
    Email: string[];


    /**
     *
     */
constructor() {};


/*
                fromJSON(json) {
        for (var propName in json)
            this[propName] = json[propName];
        return this;
        */
    }
