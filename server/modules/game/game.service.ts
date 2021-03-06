import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GameDAO } from "../db/domain/game.dao";
import { DeleteResult, Repository } from "typeorm";
import { GameStatusEnum } from "../../../common/game-status.enum";
import { GameModeEnum } from "../../../common/game-mode.enum";
import { GameDto } from "../../../common/dto/game.dto";
import { ParticipantService } from "./participant.service";
import { ParticipantDAO } from "../db/domain/participant.dao";
import { CreateGameDto } from "../../../common/dto/create-game.dto";
import { UpdateGameDto } from "../../../common/dto/update-game.dto";
import { UpdateGameStatusDto } from "../../../common/dto/update-game-status.dto";
import { CreateParticipantsDto } from "../../../common/dto/create-participants.dto";

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
        players?: CreateParticipantsDto
    ): Promise<GameDAO> {
        const gameInfo: GameDto = {
            gameMode,
            status: GameStatusEnum.STARTED,
            isPrivate,
            createdAt: new Date()
        };
        const game: GameDAO = await this.gameRepository.save(gameInfo);
        if (players) {
            for (const player of [...players.participants.values()].slice(
                0,
                players.limit
            )) {
                await this.participantService.create(game, player.id);
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
        if (participant) {
            const game: GameDAO = await participant.game;
            return await this.gameRepository.findOne({
                where: {
                    id: game.id,
                    status: GameStatusEnum.STARTED
                }
            });
        }
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

    async updateGameState(updateDTO: UpdateGameStatusDto): Promise<GameDAO> {
        await this.gameRepository.update(updateDTO.id, updateDTO);
        return await this.gameRepository.findOne(updateDTO.id);
    }
}
