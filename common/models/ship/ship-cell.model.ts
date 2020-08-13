import { ShipStateEnum } from "./ship-state.enum";
import { CoordinatesModel } from "./coordinates.model";

export interface ShipCellModel extends CoordinatesModel {
    state: ShipStateEnum;
    selectedToFire: boolean;
}
