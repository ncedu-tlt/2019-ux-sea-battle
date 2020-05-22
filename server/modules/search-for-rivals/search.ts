import { RoomDto } from "../../../common/dto/room.dto";
import { SearchDto } from "../../../common/dto/search.dto";

export interface Search {
    search(
        idToModeMapping: Map<string, SearchDto>
    ): Promise<RoomDto> | undefined;
}
