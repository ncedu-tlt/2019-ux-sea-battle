import { SearchFactory } from "./search-factory";
import { Search } from "./search";
import { GameModeEnum } from "../db/domain/game-mode.enum";
import { ClassicService } from "./modes/classic.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SearchFactoryService implements SearchFactory {
    constructor(private classicService: ClassicService) {}
    searchForRivals(mode: GameModeEnum): Search {
        if (mode === GameModeEnum.CLASSIC) {
            return this.classicService;
        } else {
            return null;
        }
    }
}
