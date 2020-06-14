import { Controller, Get, UseGuards, Request } from "@nestjs/common";
import { GameService } from "./game.service";
import { GameDto } from "../../../common/dto/game.dto";
import { AuthGuard } from "@nestjs/passport";

@Controller("/api/games")
export class GameController {
    constructor(private gameService: GameService) {}

    @UseGuards(AuthGuard())
    @Get("/current")
    async getCurrentGame(@Request() req): Promise<GameDto> {
        const user = req.user;
        return await this.gameService.getGameByUserId(user.id);
    }
}
