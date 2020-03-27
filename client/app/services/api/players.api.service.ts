import { Injectable } from "@angular/core";
import { UsersDto } from "common/dto/users.dto";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class PlayersApiService {
    constructor(private httpClient: HttpClient) {}

    getAll(): Observable<UsersDto[]> {
        return this.httpClient.get<UsersDto[]>("/api/players");
    }
}
