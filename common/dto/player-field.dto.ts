import { CellModel } from "../models/cell.model";
import { ShipModel } from "../models/ship/ship.model";

export interface PlayerFieldDto {
    ships: ShipModel[];
    cells: CellModel[];
}
