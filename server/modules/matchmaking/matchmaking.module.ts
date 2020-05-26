import { Module } from "@nestjs/common";
import { MatchmakingGateway } from "./matchmaking.gateway";
import { ClassicSearchService } from "./modes/classic-search.service";
import { AuthModule } from "../auth/auth.module";
import { DbModule } from "../db/db.module";
import { ConfigService } from "@nestjs/config";
import { GameModule } from "../game/game.module";
import { SearchServiceFactory } from "./search.service.factory";

@Module({
    imports: [AuthModule, GameModule, DbModule],
    providers: [
        MatchmakingGateway,
        ClassicSearchService,
        ConfigService,
        SearchServiceFactory
    ]
})
export class MatchmakingModule {}
