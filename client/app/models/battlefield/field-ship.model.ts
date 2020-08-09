import { ShipCellModel } from "../../../../common/models/ship/ship-cell.model";
import { TeamEnum } from "../../../../common/models/ship/team.enum";

export interface FieldShipModel {
    cellParams: ShipCellModel;
    team: TeamEnum;
    isSelected: boolean;
    movingIconLocation?: string;
}
