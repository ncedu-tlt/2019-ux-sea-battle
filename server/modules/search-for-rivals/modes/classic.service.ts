import { Injectable } from "@nestjs/common";
import { GameModeEnum } from "../../db/domain/game-mode.enum";
import { GameService } from "../../game/game.service";
import { RoomDto } from "../../../../common/dto/room.dto";
import { Search } from "../search";
import { SearchDto } from "../../../../common/dto/search.dto";
import { ParticipantService } from "../../game/participant.service";

@Injectable()
export class ClassicService implements Search {
    private mode: GameModeEnum = GameModeEnum.CLASSIC;
    constructor(
        private gameService: GameService,
        private participantService: ParticipantService
    ) {}

    async search(
        playersForClassicMode: Map<string, SearchDto>
    ): Promise<RoomDto> | undefined {
        if (playersForClassicMode.size >= 2) {
            const game = await this.gameService.create(this.mode);
            const players: string[] = [...playersForClassicMode.keys()].slice(
                0,
                2
            );
            for (const value of [...playersForClassicMode.values()].slice(
                0,
                2
            )) {
                await this.participantService.create(game, value.id);
            }
            return {
                id: game.id.toString(),
                players
            };
        }
    }
}
