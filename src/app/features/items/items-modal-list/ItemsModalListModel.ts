import { ItemViewModel } from '../item/ItemViewModel';

export class ItemsModalListModel {
    constructor(
        public itemIndex: number,
        public itemsModalListModel: ItemViewModel[] = [],
        public typeOfItemsList?: string,
    ) {}
}
