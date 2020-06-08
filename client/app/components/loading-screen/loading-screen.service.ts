import { Injectable } from "@angular/core";
import { GameModeEnum } from "../../../../common/game-mode.enum";

@Injectable()
export class LoadingScreenService {
    getGameMode(gameMode: string): string {
        if (gameMode === GameModeEnum.CLASSIC) {
            return "Классика";
        }
    }
}
