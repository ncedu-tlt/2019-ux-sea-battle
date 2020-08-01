import {
    Controller,
    Get,
    UseGuards,
    Request,
    Patch,
    Param,
    Body
} from "@nestjs/common";
import { GameService } from "./game.service";
import { GameDto } from "../../../common/dto/game.dto";
import { AuthGuard } from "@nestjs/passport";
import { UpdateGameDto } from "../../../common/dto/update-game.dto";
import { GameDAO } from "../db/domain/game.dao";

@Controller("/api/games")
export class GameController {
    constructor(private gameService: GameService) {}

    @UseGuards(AuthGuard())
    @Get("/current")
    async getCurrentGame(@Request() req): Promise<GameDto> {
        const user = req.user;
        return await this.gameService.getGameByUserId(user.id);
    }

    @UseGuards(AuthGuard())
    @Patch()
    async update(
        @Param("id") id: number,
        @Body() game: UpdateGameDto
    ): Promise<GameDAO> {
        game.id = Number(id);
        return this.gameService.updateGame(game);
    }
}
