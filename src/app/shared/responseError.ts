import { ResponseMessage } from './responseMessage';


export class ResponseError {
    /**
     *
     */
    succeeded: boolean;
    errors: ResponseMessage[];
    constructor( ) {
    }

}
