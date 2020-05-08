import { Module } from "@nestjs/common";
import { DbModule } from "../db/db.module";
import { GameService } from "./game.service";

@Module({
    imports: [DbModule],
    providers: [GameService],
    controllers: []
})
export class GameModule {}
