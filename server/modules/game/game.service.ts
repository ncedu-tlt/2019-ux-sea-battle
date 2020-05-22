import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GameDAO } from "../db/domain/game.dao";
import { Repository } from "typeorm";
import { GameStatusEnum } from "../db/domain/game-status.enum";
import { GameModeEnum } from "../db/domain/game-mode.enum";
import { GameDto } from "../../../common/dto/game.dto";

@Injectable()
export class GameService {
    constructor(
        @InjectRepository(GameDAO)
        private gameRepository: Repository<GameDAO>
    ) {}

    getAll(): Promise<GameDAO[]> {
        return this.gameRepository.find();
    }

    findById(id: number): Promise<GameDAO> {
        return this.gameRepository.findOne(id);
    }

    create(gameMode: GameModeEnum, isPrivate = false): Promise<GameDAO> {
        const game: GameDto = {
            gameMode,
            status: GameStatusEnum.WAITING,
            isPrivate,
            createdAt: new Date()
        };
        return this.gameRepository.save(game);
    }
}
