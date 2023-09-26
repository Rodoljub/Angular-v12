import { ItemViewModel } from '../../items/item/ItemViewModel';
import { AnalyzingImageModel } from './AnalyzingImageModel';

export class UploadStateModel {
    constructor(
        public open: boolean,
        public item: ItemViewModel,
        public uploadingFiles: string[],
        public analyzingImages: AnalyzingImageModel[]
    ) {}
}
