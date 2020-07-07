import { CoordinatesModel } from "./coordinates.model";

export interface CellModel extends CoordinatesModel {
    hit: boolean;
}
