export class DeleteEntitiesModel {
    constructor(
        public entitiesIds: string[],
        public typeAction: string,
        public entityType?: string,
    ) {}
}
