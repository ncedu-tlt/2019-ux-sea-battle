import { Injectable } from "@nestjs/common";
import { GameModeEnum } from "../../../../common/game-mode.enum";
import { GameService } from "../../game/game.service";
import { RoomDto } from "../../../../common/dto/room.dto";
import { SearchService } from "../search.service";
import { SearchDto } from "../../../../common/dto/search.dto";

@Injectable()
export class ClassicSearchService implements SearchService {
    constructor(private gameService: GameService) {}

    async search(
        participants: Map<string, SearchDto>
    ): Promise<RoomDto | undefined> {
        if (participants.size >= 2) {
            const game = await this.gameService.create(
                GameModeEnum.CLASSIC,
                false,
                participants
            );
            const players: string[] = [...participants.keys()].slice(0, 2);
            return {
                id: game.id.toString(),
                players
            };
        }
    }
}
