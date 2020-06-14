import {
    IsBoolean,
    IsDate,
    IsEnum,
    IsNumber,
    IsOptional,
    IsString
} from "class-validator";
import { GameModeEnum } from "../game-mode.enum";
import { GameStatusEnum } from "../../server/modules/db/domain/game-status.enum";

export class UpdateGameDto {
    @IsNumber()
    id: number;

    @IsOptional()
    @IsEnum(GameModeEnum)
    gameMode?: GameModeEnum;

    @IsOptional()
    @IsEnum(GameStatusEnum)
    status?: GameStatusEnum;

    @IsOptional()
    @IsString()
    roomName?: string;

    @IsBoolean()
    isPrivate?: boolean;

    @IsOptional()
    @IsDate()
    createdAt?: Date;
}
