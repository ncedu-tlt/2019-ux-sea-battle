import {Injectable} from "@angular/core";
import {PlayerDTO} from "common/dto/player.dto";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
    providedIn: "root"
})
export class PlayersApiService {

    constructor(private httpClient: HttpClient) {
    }

    getAll(): Observable<PlayerDTO[]> {
        return this.httpClient.get<PlayerDTO[]>("/api/players");
    }
}
