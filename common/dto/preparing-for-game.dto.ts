import { WaitingForPlayerDto } from "./waiting-for-player.dto";

export interface PreparingForGameDto {
    limit: number;
    players: WaitingForPlayerDto[];
    timer: number;
}
