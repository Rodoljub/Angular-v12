export class SaveImageFileModel {
    /**
     *
     */
    constructor(
        public ID: string,
        public Base64Image: string,
        public Extension: string,
        public Type: string,
        public Width: number
    ) { }
}
