import { CellModel } from "./cell.model";
import { FieldShipModel } from "./field-ship.model";

export interface FieldModel {
    model: FieldShipModel | CellModel;
}
