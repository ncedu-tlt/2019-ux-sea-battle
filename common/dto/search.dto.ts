import { IsEnum } from "class-validator";
import { GameModeEnum } from "../../server/modules/db/domain/game-mode.enum";

export class SearchDto {
    @IsEnum(GameModeEnum)
    gameMode: GameModeEnum;
}
