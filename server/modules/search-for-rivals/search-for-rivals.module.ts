import { Module } from "@nestjs/common";
import { SearchForRivalsGateway } from "./search-for-rivals.gateway";
import { ClassicService } from "./classic.service";
import { AuthModule } from "../auth/auth.module";
import { GameService } from "../game/game.service";
import { DbModule } from "../db/db.module";
import { JwtWsStrategy } from "./strategy/jwt-ws.strategy";
import { UsersService } from "../users/users.service";
import { WsExceptionHandlingService } from "./ws-exception-handling.service";

@Module({
    imports: [AuthModule, DbModule],
    providers: [
        SearchForRivalsGateway,
        GameService,
        ClassicService,
        JwtWsStrategy,
        UsersService,
        WsExceptionHandlingService
    ],
    controllers: []
})
export class SearchForRivalsModule {}
