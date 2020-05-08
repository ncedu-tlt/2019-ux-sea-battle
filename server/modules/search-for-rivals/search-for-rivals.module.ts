import { Module } from "@nestjs/common";
import { SearchForRivalsGateway } from "./search-for-rivals.gateway";
import { ClassicService } from "./classic.service";
import { AuthModule } from "../auth/auth.module";
import { GameService } from "../game/game.service";
import { DbModule } from "../db/db.module";

@Module({
    imports: [AuthModule, DbModule],
    providers: [SearchForRivalsGateway, GameService, ClassicService],
    controllers: []
})
export class SearchForRivalsModule {}
