import { ShipCellModel } from "./ship-cell.model";
import { ShipColorEnum } from "./styles/ship-color.enum";

export interface ShipModel {
    cells: ShipCellModel[];
    team: ShipColorEnum;
    isMoving: boolean;
}
