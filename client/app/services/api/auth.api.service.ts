import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { RegisterRequestDTO } from "../../../../common/dto/register-request.dto";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class AuthApiService {
    constructor(private httpClient: HttpClient) {}

    registration(
        registrationBody: RegisterRequestDTO
    ): Observable<RegisterRequestDTO> {
        return this.httpClient.post<RegisterRequestDTO>(
            "/api/auth/register",
            registrationBody
        );
    }
}
