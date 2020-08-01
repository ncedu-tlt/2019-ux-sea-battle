import { ShipsTypeEnum } from "./ships-type.enum";

export interface ShipsParamsModel {
    type: ShipsTypeEnum;
    count: number;
    isSelected: boolean;
}
