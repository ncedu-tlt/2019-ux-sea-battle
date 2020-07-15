import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { UserDTO } from "common/dto/user.dto";
import { CurrentUserService } from "./../../services/current-user.service";
import { TokenService } from "./../../services/token.service";

@Component({
    selector: "sb-sidebar",
    templateUrl: "./sidebar.component.html"
})
export class SidebarComponent implements OnInit {
    user: UserDTO;

    constructor(
        private tokenService: TokenService,
        private router: Router,
        private currentUserService: CurrentUserService
    ) {}

    ngOnInit(): void {
        this.currentUserService
            .getCurrentUser()
            .subscribe((u: UserDTO) => (this.user = u));
    }

    logout(): void {
        this.tokenService.deleteToken();
        this.router.navigate(["/login"]);
    }
}
