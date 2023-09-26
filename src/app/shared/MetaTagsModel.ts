export class MetaTagsModel {
    constructor(
        public Type: string,
        public Title: string,
        public Description: string,
        public ImageUrl: string,
        public Url: string,
        public SiteName: string,
        public Keywords: string[]
    ) {}
}
