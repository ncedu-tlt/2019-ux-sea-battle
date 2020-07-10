import { Component, Output, EventEmitter, OnInit } from "@angular/core";
import { UsersApiService } from "client/app/services/api/users.api.service";
import { UserDTO } from "common/dto/user.dto";

@Component({
    selector: "sb-header",
    templateUrl: "./header.component.html"
})
export class HeaderComponent implements OnInit {
    user: UserDTO;

    @Output()
    sidebarToggle = new EventEmitter();

    constructor(private usersService: UsersApiService) {}

    ngOnInit(): void {
        this.usersService
            .getCurrent()
            .subscribe((user: UserDTO) => (this.user = user));
    }

    toggleSidebar(): void {
        this.sidebarToggle.emit();
    }
}
