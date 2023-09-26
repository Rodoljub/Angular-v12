import { ImageAnalysis } from "../../shared/ImageAnalysis/ImageAnalysis";

export class FileDetailsModel {
    constructor(
        public color: string,
        public width: number,
        public height: number,
        public imageAnalysis: ImageAnalysis
    ) {}
}
