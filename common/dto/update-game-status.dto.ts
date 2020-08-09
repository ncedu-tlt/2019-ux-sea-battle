import { IsEnum, IsNumber } from "class-validator";
import { GameStatusEnum } from "../game-status.enum";

export class UpdateGameStatusDto {
    @IsNumber()
    id: number;

    @IsEnum(GameStatusEnum)
    status: GameStatusEnum;
}
