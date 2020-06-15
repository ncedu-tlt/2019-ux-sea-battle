import { GameModeEnum } from "../game-mode.enum";
import { GameStatusEnum } from "../../server/modules/db/domain/game-status.enum";

export interface GameDto {
    gameMode: GameModeEnum;
    status: GameStatusEnum;
    isPrivate: boolean;
    createdAt: Date;
}
