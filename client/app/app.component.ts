import { Component, OnInit } from "@angular/core";
import { UsersApiService } from "client/app/services/api/users.api.service";
import { Observable } from "rxjs";
import { UserDTO } from "common/dto/user.dto";

@Component({
    selector: "sb-root",
    templateUrl: "./app.component.html"
})
export class AppComponent implements OnInit {
    users: Observable<UserDTO[]>;

    constructor(private usersApiService: UsersApiService) {}

    ngOnInit(): void {
        this.users = this.usersApiService.getAll();
    }
}
