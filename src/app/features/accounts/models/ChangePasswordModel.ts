export class ChangePasswordModel {
    /**
     *
     */
    constructor(
        public CurrentPassword: string,
        public Password: string,
        public ConfirmPassword: string) { }
}
