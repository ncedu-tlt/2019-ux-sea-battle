import { IsEnum, IsNumber } from "class-validator";
import { GameModeEnum } from "../../server/modules/db/domain/game-mode.enum";

export class SearchDto {
    @IsNumber()
    id: number;

    @IsEnum(GameModeEnum)
    gameMode: GameModeEnum;
}
