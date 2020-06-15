import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Patch,
    Post
} from "@nestjs/common";
import { GameService } from "./game.service";
import { Roles } from "../../decorators/role.decorator";
import { RoleEnum } from "../db/domain/role.enum";
import { GameDAO } from "../db/domain/game.dao";
import { CreateGameDto } from "../../../common/dto/create-game.dto";
import { UpdateGameDto } from "../../../common/dto/update-game.dto";

@Controller("/api/management/games")
export class GameManagementController {
    constructor(private gameService: GameService) {}

    @Get()
    @Roles(RoleEnum.ADMIN)
    async getAll(): Promise<GameDAO[]> {
        return this.gameService.getAll();
    }

    @Get(":id")
    @Roles(RoleEnum.ADMIN)
    async getGame(@Param("id") id: number): Promise<GameDAO> {
        const game: GameDAO = await this.gameService.getGame(id);
        if (!game) {
            throw new HttpException(
                "game/gameDoesNotExist",
                HttpStatus.NOT_FOUND
            );
        }
        return game;
    }

    @Post()
    @Roles(RoleEnum.ADMIN)
    async create(@Body() game: CreateGameDto): Promise<GameDAO> {
        return this.gameService.createGame(game);
    }

    @Patch()
    @Roles(RoleEnum.ADMIN)
    async update(
        @Param("id") id: number,
        @Body() game: UpdateGameDto
    ): Promise<GameDAO> {
        game.id = Number(id);
        return this.gameService.updateGame(game);
    }

    @Delete(":id")
    @Roles(RoleEnum.ADMIN)
    async delete(@Param("id") id: number): Promise<void> {
        await this.gameService.deleteGame(id);
    }
}
