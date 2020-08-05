import { Component, OnInit } from "@angular/core";
import { CurrentUserService } from "client/app/services/current-user.service";
import { Router } from "@angular/router";
import { UpdateCurrentUserModel } from "../../models/update-current-user.model";
import { CurrentUserDTO } from "./../../../../dist/server/common/dto/current-user.dto.d";

@Component({
    selector: "sb-edit-profile",
    templateUrl: "./edit-profile.component.html"
})
export class EditProfileComponent implements OnInit {
    user: CurrentUserDTO;
    errorsCode: number;

    constructor(
        private currentUserService: CurrentUserService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.currentUserService
            .getCurrentUser()
            .subscribe((u: CurrentUserDTO) => (this.user = u));
    }

    onSaveChanges(updateUserModel: UpdateCurrentUserModel): void {
        this.currentUserService.updateCurrentUser(updateUserModel).subscribe(
            () => {
                this.currentUserService.fetchCurrentUser();
                this.router.navigate(["/"]);
            },
            err => {
                this.errorsCode = err.error.statusCode;
            }
        );
    }
}
