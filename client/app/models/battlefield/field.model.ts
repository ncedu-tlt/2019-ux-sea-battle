import { ShipModel } from "./ship.model";
import { CellModel } from "./cell.model";

export interface FieldModel {
    model: ShipModel | CellModel;
}
