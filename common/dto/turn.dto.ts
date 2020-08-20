import { PlayerFieldDto } from "./player-field.dto";

export interface TurnDto extends PlayerFieldDto {
    timer: number;
    name: string;
    isWaiting: boolean;
}
