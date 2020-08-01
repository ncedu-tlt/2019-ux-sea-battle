import { TeamEnum } from "../../../../common/models/ship/team.enum";
import { ShipsTypeEnum } from "./ships-type.enum";

export interface ShipLayoutModel {
    color: TeamEnum;
    type: ShipsTypeEnum;
    count: number;
    isSelected: boolean;
}
