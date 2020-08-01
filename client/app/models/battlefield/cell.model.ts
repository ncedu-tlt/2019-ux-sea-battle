import { CoordinatesModel } from "../../../../common/models/ship/coordinates.model";

export interface CellModel extends CoordinatesModel {
    hit: boolean;
}
