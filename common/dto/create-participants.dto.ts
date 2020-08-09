import { SearchDto } from "./search.dto";

export interface CreateParticipantsDto {
    limit: number;
    participants: Map<string, SearchDto>;
}
