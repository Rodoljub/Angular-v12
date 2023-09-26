import { AdultInfo } from "./AdultInfo/AdultInfo";
import { DetectedBrand } from "./Brands/DetectedBrand";
import { Category } from "./Categories/Category";
import { ColorInfo } from "./Color/ColorInfo";
import { ImageDescriptionDetails } from "./Description/ImageDescriptionDetails";
import { FaceDescription } from "./Faces/FaceDescription";
import { ImageType } from "./ImageType/ImageType";
import { ImageMetadata } from "./Metadata/ImageMetadata";
import { DetectedObject } from "./Objects/DetectedObject";
import { ImageTag } from "./Tags/ImageTag";

export class ImageAnalysis{
    public categories: Category[];
    public adult: AdultInfo;
    public color: ColorInfo;
    public imageType: ImageType;
    public tags: ImageTag[];
    public description: ImageDescriptionDetails;
    public faces: FaceDescription[];
    public objects: DetectedObject[];
    public brands: DetectedBrand[];
    public metadata: ImageMetadata;
}