import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { GameModule } from "../game/game.module";
import { WaitingForPlacementGateway } from "./waiting-for-placement.gateway";

@Module({
    imports: [AuthModule, GameModule],
    providers: [WaitingForPlacementGateway]
})
export class WaitingForPlacementModule {}
