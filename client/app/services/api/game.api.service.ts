import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { GameDto } from "../../../../common/dto/game.dto";

@Injectable({ providedIn: "root" })
export class GameApiService {
    constructor(private httpClient: HttpClient) {}

    getGame(): Observable<GameDto> {
        return this.httpClient.get<GameDto>("/api/game/current");
    }
}
