import { Module } from "@nestjs/common";
import { SearchForRivalsGateway } from "./search-for-rivals.gateway";
import { ClassicService } from "./modes/classic.service";
import { AuthModule } from "../auth/auth.module";
import { DbModule } from "../db/db.module";
import { ConfigService } from "@nestjs/config";
import { GameModule } from "../game/game.module";
import { SearchFactoryService } from "./search-factory.service";

@Module({
    imports: [AuthModule, GameModule, DbModule],
    providers: [
        SearchForRivalsGateway,
        ClassicService,
        ConfigService,
        SearchFactoryService
    ]
})
export class SearchForRivalsModule {}
