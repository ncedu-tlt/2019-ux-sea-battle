import { RoomDto } from "../../../common/dto/room.dto";
import { SearchDto } from "../../../common/dto/search.dto";

export interface SearchService {
    search(participants: Map<string, SearchDto>): Promise<RoomDto>;
}
