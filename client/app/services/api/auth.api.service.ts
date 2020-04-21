import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { RegisterRequestDTO } from "../../../../common/dto/register-request.dto";
import { LoginRequestDTO } from "./../../../../common/dto/login-request.dto";
import { LoginResponseDTO } from "./../../../../common/dto/login-response.dto";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class AuthApiService {
    constructor(private httpClient: HttpClient) {}

    register(
        registrationBody: RegisterRequestDTO
    ): Observable<RegisterRequestDTO> {
        return this.httpClient.post<RegisterRequestDTO>(
            "/api/auth/register",
            registrationBody
        );
    }

    login(loginBody: LoginRequestDTO): Observable<LoginResponseDTO> {
        return this.httpClient.post<LoginResponseDTO>(
            "/api/auth/login",
            loginBody
        );
    }
}
