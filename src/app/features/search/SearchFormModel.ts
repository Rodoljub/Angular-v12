export class SearchFormModel {
    constructor(
        public searchFormOpen: boolean,
        public input: string,
        public selectedTags: string[],
        public search: boolean
    ) {}
    // input: string;
    // selectedTags: string[];
}
