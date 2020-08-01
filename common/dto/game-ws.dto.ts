import { PlayerDto } from "./player.dto";

export interface GameWsDto {
    limit: number;
    players: PlayerDto[];
}
