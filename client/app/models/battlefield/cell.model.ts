import { CoordinatesModel } from "./coordinates.model";

export interface CellModel {
    coordinates: CoordinatesModel;
    hit: boolean;
}
