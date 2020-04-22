import { CookieService } from "ngx-cookie-service";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class TokenService {
    constructor(private cookieService: CookieService) {
        this.accessToken = this.cookieService.get("accessToken");
    }

    private accessToken: string;

    getToken(): string {
        return this.accessToken;
    }

    setToken(token: string): void {
        this.accessToken = token;
        this.cookieService.set("accessToken", token);
    }

    deleteToken(): void {
        this.accessToken = "";
        this.cookieService.delete("accessToken");
    }
}
