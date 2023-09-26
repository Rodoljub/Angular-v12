import { BoundingRect } from "./BoundingRect";
import { ObjectHierarchy } from "./ObjectHierarchy";

export class DetectedObject{
    public rectangle: BoundingRect;
    public objectProperty: string;
    public confidence: number;
    public parent: ObjectHierarchy
}