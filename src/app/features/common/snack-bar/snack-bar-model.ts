export class SnackBarModel {
    constructor(
        public message: string,
        public type: string,
        public action?: string,
        public collectionData?: string[]
    ) {}
}
