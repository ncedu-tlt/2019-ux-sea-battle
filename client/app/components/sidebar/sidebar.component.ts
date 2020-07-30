import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CurrentUserService } from "./../../services/current-user.service";
import { TokenService } from "./../../services/token.service";
import { CurrentUserDTO } from "./../../../../dist/server/common/dto/current-user.dto.d";

@Component({
    selector: "sb-sidebar",
    templateUrl: "./sidebar.component.html"
})
export class SidebarComponent implements OnInit {
    user: CurrentUserDTO;

    constructor(
        private tokenService: TokenService,
        private router: Router,
        private currentUserService: CurrentUserService
    ) {}

    ngOnInit(): void {
        this.currentUserService
            .getCurrentUser()
            .subscribe((u: CurrentUserDTO) => (this.user = u));
    }

    logout(): void {
        this.tokenService.deleteToken();
        this.currentUserService.deleteCurrentUser();
        this.router.navigate(["/login"]);
    }
}
