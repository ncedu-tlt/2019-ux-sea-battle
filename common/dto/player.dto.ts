import { ShipModel } from "../models/ship/ship.model";
import { CellModel } from "../models/cell.model";

export interface PlayerDto {
    id: string;
    name: string;
    ships: ShipModel[];
    cells: CellModel[];
}
