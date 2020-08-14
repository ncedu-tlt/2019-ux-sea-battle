import { ShipModel } from "../models/ship/ship.model";
import { CellModel } from "../models/cell.model";

export interface PlayerDto {
    id: string;
    ships: ShipModel[];
    cells: CellModel[];
}
