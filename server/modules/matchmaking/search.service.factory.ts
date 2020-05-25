import { SearchService } from "./search.service";
import { GameModeEnum } from "../db/domain/game-mode.enum";
import { ClassicSearchService } from "./modes/classic-search.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SearchServiceFactory {
    constructor(private classicService: ClassicSearchService) {}
    getService(mode: GameModeEnum): SearchService {
        if (mode === GameModeEnum.CLASSIC) {
            return this.classicService;
        } else {
            return null;
        }
    }
}
