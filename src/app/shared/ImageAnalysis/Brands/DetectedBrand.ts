import { BoundingRect } from "../Objects/BoundingRect";

export class DetectedBrand{
    public name: string;
    public confidence: number;
    public rectangle: BoundingRect;
}