import { Module } from "@nestjs/common";
import { DbModule } from "../db/db.module";
import { GameService } from "./game.service";
import { ParticipantService } from "./participant.service";
import { UsersModule } from "../users/users.module";

@Module({
    imports: [DbModule, UsersModule],
    providers: [GameService, ParticipantService],
    exports: [GameService, UsersModule, ParticipantService]
})
export class GameModule {}
