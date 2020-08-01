import { ShipCellModel } from "./ship-cell.model";
import { TeamEnum } from "./team.enum";

export interface ShipModel {
    cells: ShipCellModel[];
    team: TeamEnum;
    isSelected: boolean;
}
