import { ShipStateEnum } from "./ship-state.enum";

export interface ShipCellModel {
    X: number;
    Y: number;
    state: ShipStateEnum;
}
