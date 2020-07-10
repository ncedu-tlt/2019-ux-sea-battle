import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { UserDTO } from "common/dto/user.dto";
import { UsersApiService } from "./../../services/api/users.api.service";
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
        private usersService: UsersApiService
    ) {}

    ngOnInit(): void {
        this.usersService
            .getCurrent()
            .subscribe((user: UserDTO) => (this.user = user));
    }

    logout(): void {
        this.tokenService.deleteToken();
        this.router.navigate(["/login"]);
    }
}
