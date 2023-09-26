export class CreateUserModel {
    /**
     *
     */
    constructor(public Name: string,
                public Email: string,
                public Password: string,
                public ReturnUrl: string ) { }
}
