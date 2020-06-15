import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GameDAO } from "../db/domain/game.dao";
import { DeleteResult, Repository } from "typeorm";
import { GameStatusEnum } from "../db/domain/game-status.enum";
import { GameModeEnum } from "../../../common/game-mode.enum";
import { GameDto } from "../../../common/dto/game.dto";
import { SearchDto } from "../../../common/dto/search.dto";
import { ParticipantService } from "./participant.service";
import { ParticipantDAO } from "../db/domain/participant.dao";
import { CreateGameDto } from "../../../common/dto/create-game.dto";
import { UpdateGameDto } from "../../../common/dto/update-game.dto";

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

    async create(
        gameMode: GameModeEnum,
        isPrivate?: boolean,
        participants?: Map<string, SearchDto>
    ): Promise<GameDAO> {
        const gameInfo: GameDto = {
            gameMode,
            status: GameStatusEnum.STARTED,
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

    async getGame(id: number): Promise<GameDAO> {
        return await this.gameRepository.findOne(id);
    }

    async getGameByUserId(id: number): Promise<GameDAO> {
        const participant: ParticipantDAO = await this.participantService.getParticipantByUserId(
            id
        );
        return await this.gameRepository.findOne(await participant.game, {
            where: { status: GameStatusEnum.STARTED }
        });
    }

    async createGame(createDTO: CreateGameDto): Promise<GameDAO> {
        return await this.gameRepository.save(createDTO);
    }

    async updateGame(updateDTO: UpdateGameDto): Promise<GameDAO> {
        await this.gameRepository.update(updateDTO.id, updateDTO);
        return await this.gameRepository.findOne(updateDTO.id);
    }

    async deleteGame(id: number): Promise<DeleteResult> {
        const game: GameDAO = await this.gameRepository.findOne(id);
        if (!game) {
            if (!game) {
                throw new HttpException(
                    "game/gameDoesNotExist",
                    HttpStatus.NOT_FOUND
                );
            }
        }
        return await this.gameRepository.delete(id);
    }
}
