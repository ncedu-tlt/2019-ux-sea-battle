import { GameModeEnum } from "../db/domain/game-mode.enum";
import { Search } from "./search";

export interface SearchFactory {
    searchForRivals(mode: GameModeEnum): Search;
}
