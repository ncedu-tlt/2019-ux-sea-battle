import { CoordinatesModel } from "./ship/coordinates.model";

export interface CellModel extends CoordinatesModel {
    hit: boolean;
    selectedToFire: boolean;
}
