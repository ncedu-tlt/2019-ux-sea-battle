import { Injectable } from "@nestjs/common";
import { GameModeEnum } from "../db/domain/game-mode.enum";
import { GameService } from "../game/game.service";
import { RoomDto } from "../../../common/dto/room.dto";

@Injectable()
export class ClassicService {
    constructor(private gameService: GameService) {}

    async classicModeSearch(
        socketToRivalsMapping: Map<string, string>,
        mode: GameModeEnum
    ): Promise<RoomDto> {
        const playersForClassicMode = new Map<string, string>(
            [...socketToRivalsMapping].filter(
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                ([key, value]) => value === GameModeEnum.CLASSIC
            )
        );
        if (playersForClassicMode.size === 2) {
            const game = await this.gameService.create(mode);
            const players: string[] = [...playersForClassicMode.keys()];
            return {
                id: game.id.toString(),
                players
            };
        }
    }
}
