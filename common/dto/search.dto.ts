import { IsEnum, IsNumber } from "class-validator";
import { GameModeEnum } from "../game-mode.enum";

export class SearchDto {
    @IsNumber()
    id: number;

    @IsEnum(GameModeEnum)
    gameMode: GameModeEnum;
}
