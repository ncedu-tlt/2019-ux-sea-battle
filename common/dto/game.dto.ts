import { GameModeEnum } from "../game-mode.enum";
import { GameStatusEnum } from "../game-status.enum";

export interface GameDto {
    gameMode: GameModeEnum;
    status: GameStatusEnum;
    isPrivate: boolean;
    createdAt: Date;
}
