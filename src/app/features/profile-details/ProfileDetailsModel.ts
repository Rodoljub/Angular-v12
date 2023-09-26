import { AnalyzingImageModel } from '../upload/models/AnalyzingImageModel';

export class ProfileDetailsModel {
    constructor(
        public name: string,
        public imagePath: string,
        public analyzingImageViewModel: AnalyzingImageModel,
        public uploadsCount: number,
        public commentsCount: number,
        public likesCount: number,
        public favouritesCount: number
    ) {}
}
