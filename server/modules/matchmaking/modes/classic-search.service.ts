import { Injectable, Logger } from "@nestjs/common";
import { GameModeEnum } from "../../../../common/game-mode.enum";
import { GameService } from "../../game/game.service";
import { RoomDto } from "../../../../common/dto/room.dto";
import { SearchService } from "../search.service";
import { SearchDto } from "../../../../common/dto/search.dto";
import { GameDAO } from "../../db/domain/game.dao";

@Injectable()
export class ClassicSearchService implements SearchService {
    constructor(private gameService: GameService) {}

    async search(
        participants: Map<string, SearchDto>
    ): Promise<RoomDto | undefined> {
        const limit = 2;
        if (participants.size >= limit) {
            const game: GameDAO = await this.gameService.create(
                GameModeEnum.CLASSIC,
                false,
                { limit, participants }
            );
            Logger.debug("classic-search.service - game:");
            Logger.debug(game);
            const players: string[] = [...participants.keys()].slice(0, limit);
            return {
                id: game.id.toString(),
                players
            };
        }
    }
}
