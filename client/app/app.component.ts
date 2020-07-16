import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { TokenService } from "./services/token.service";

@Component({
    selector: "sb-root",
    templateUrl: "./app.component.html"
})
export class AppComponent {
    opened = false;

    constructor(private tokenService: TokenService, private router: Router) {
        this.router.events.subscribe(() => (this.opened = false));
    }

    toggleSidebar(): void {
        this.opened = !this.opened;
    }

    isAuthorized(): boolean {
        return Boolean(this.tokenService.getToken());
    }
}
