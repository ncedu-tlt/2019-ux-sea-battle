import { CookieService } from "ngx-cookie-service";
import { Injectable } from "@angular/core";

const TOKEN_COOKIE = "accessToken";

@Injectable({
    providedIn: "root"
})
export class TokenService {
    private accessToken: string;

    constructor(private cookieService: CookieService) {
        this.accessToken = this.cookieService.get(TOKEN_COOKIE);
    }

    getToken(): string {
        return this.accessToken;
    }

    setToken(token: string): void {
        this.accessToken = token;
        this.cookieService.set(TOKEN_COOKIE, token);
    }

    deleteToken(): void {
        this.accessToken = "";
        this.cookieService.delete(TOKEN_COOKIE);
    }
}
