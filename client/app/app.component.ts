import { Component, OnInit } from "@angular/core";
import { UsersApiService } from "client/app/services/api/users.api.service";
import { Observable } from "rxjs";
import { UsersDto } from "common/dto/users.dto";

@Component({
    selector: "sb-root",
    template: `
        {{ users | async | json }}
    `
})
export class AppComponent implements OnInit {
    users: Observable<UsersDto[]>;

    constructor(private usersApiService: UsersApiService) {}

    ngOnInit(): void {
        this.users = this.usersApiService.getAll();
    }
}
