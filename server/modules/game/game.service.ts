import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GameDAO } from "../db/domain/game.dao";
import { Repository } from "typeorm";
import { GameStatusEnum } from "../db/domain/game-status.enum";
import { GameModeEnum } from "../db/domain/game-mode.enum";

@Injectable()
export class GameService {
    constructor(
        @InjectRepository(GameDAO)
        private gameRepository: Repository<GameDAO>
    ) {}

    getAll(): Promise<GameDAO[]> {
        return this.gameRepository.find();
    }

    create(gameMode: GameModeEnum): Promise<GameDAO> {
        const game = {
            gameMode,
            status: GameStatusEnum.WAITING,
            isPrivate: false,
            createdAt: new Date()
        };
        return this.gameRepository.save(game);
    }
}
