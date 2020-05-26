import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GameDAO } from "../db/domain/game.dao";
import { Repository } from "typeorm";
import { GameStatusEnum } from "../db/domain/game-status.enum";
import { GameModeEnum } from "../db/domain/game-mode.enum";
import { GameDto } from "../../../common/dto/game.dto";
import { SearchDto } from "../../../common/dto/search.dto";
import { ParticipantService } from "./participant.service";

@Injectable()
export class GameService {
    constructor(
        @InjectRepository(GameDAO)
        private gameRepository: Repository<GameDAO>,
        private participantService: ParticipantService
    ) {}

    getAll(): Promise<GameDAO[]> {
        return this.gameRepository.find();
    }

    findById(id: number): Promise<GameDAO> {
        return this.gameRepository.findOne(id);
    }

    async create(
        gameMode: GameModeEnum,
        isPrivate?: boolean,
        participants?: Map<string, SearchDto>
    ): Promise<GameDAO> {
        const gameInfo: GameDto = {
            gameMode,
            status: GameStatusEnum.WAITING,
            isPrivate,
            createdAt: new Date()
        };
        const game: GameDAO = await this.gameRepository.save(gameInfo);
        if (participants) {
            for (const value of [...participants.values()].slice(0, 2)) {
                await this.participantService.create(game, value.id);
            }
        }
        return game;
    }
}
