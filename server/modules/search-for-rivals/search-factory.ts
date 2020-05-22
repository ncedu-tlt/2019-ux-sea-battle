import { GameModeEnum } from "../db/domain/game-mode.enum";
import { SearchDto } from "../../../common/dto/search.dto";
import { Search } from "./search";

export interface SearchFactory {
    searchForRivals(
        mode: GameModeEnum,
        idToModeMapping: Map<string, SearchDto>
    ): Search;
}
