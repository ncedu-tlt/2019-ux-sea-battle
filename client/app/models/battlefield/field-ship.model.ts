import { ShipCellModel } from "./ship-cell.model";
import { ShipColorEnum } from "./styles/ship-color.enum";

export interface FieldShipModel {
    cellParams: ShipCellModel;
    team: ShipColorEnum;
    isSelected: boolean;
}
