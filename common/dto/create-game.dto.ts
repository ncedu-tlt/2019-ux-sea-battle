import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";
import { GameModeEnum } from "../game-mode.enum";
import { GameStatusEnum } from "../game-status.enum";

export class CreateGameDto {
    @IsEnum(GameModeEnum)
    gameMode: GameModeEnum;

    @IsEnum(GameStatusEnum)
    status: GameStatusEnum;

    @IsOptional()
    @IsString()
    roomName?: string;

    @IsBoolean()
    isPrivate: boolean;
}
