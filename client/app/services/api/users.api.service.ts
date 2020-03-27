import { Injectable } from "@angular/core";
import { UserDTO } from "common/dto/user.dto";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class UsersApiService {
    constructor(private httpClient: HttpClient) {}

    getAll(): Observable<UserDTO[]> {
        return this.httpClient.get<UserDTO[]>("/api/users");
    }
}
