import { Module } from "@nestjs/common";
import { PlayersController } from "server/modules/players/players.controller";
import { DbModule } from "../db/db.module";

@Module({
    imports: [DbModule],
    controllers: [PlayersController]
})
export class PlayersModule {}
