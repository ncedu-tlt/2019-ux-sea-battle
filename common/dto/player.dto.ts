import { ShipModel } from "../models/ship/ship.model";

export interface PlayerDto {
    id: string;
    ships: ShipModel[];
}
