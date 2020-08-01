import { FormGroup, Validators, AbstractControl } from "@angular/forms";
import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { fileSize } from "client/app/validators/fileSize";
import { fileExtension } from "client/app/validators/fileExtension";
import { CurrentUserDTO } from "./../../../../dist/server/common/dto/current-user.dto.d";
import { UpdateCurrentUserDto } from "./../../../../common/dto/update-current-user.dto";

@Component({
    selector: "sb-edit-profile-details",
    templateUrl: "./edit-profile-details.component.html",
    styleUrls: ["./edit-profile-details.component.less"]
})
export class EditProfileDetailsComponent implements OnInit {
    @Input()
    user: CurrentUserDTO;

    @Input()
    errorsCode: number;

    @Output()
    saveChanges = new EventEmitter<UpdateCurrentUserDto>();

    editForm: FormGroup;

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        this.editForm = this.fb.group(
            {
                avatar: null,
                email: [
                    this.user.email,
                    Validators.compose([
                        Validators.required,
                        Validators.pattern(
                            "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"
                        )
                    ])
                ],
                nickname: [
                    this.user.nickname,
                    Validators.compose([
                        Validators.required,
                        Validators.minLength(3),
                        Validators.maxLength(20)
                    ])
                ]
            },
            {
                validator: [
                    fileSize("avatar", 1000000),
                    fileExtension("avatar", ["png", "jpg", "jpeg"])
                ]
            }
        );
    }

    get _avatar(): AbstractControl {
        return this.editForm.get("avatar");
    }

    get _email(): AbstractControl {
        return this.editForm.get("email");
    }

    get _nickname(): AbstractControl {
        return this.editForm.get("nickname");
    }

    onSubmit(): void {
        const updatedUser: UpdateCurrentUserDto = {
            email: this.editForm.value.email,
            nickname: this.editForm.value.nickname,
            avatarUrl:
                this.editForm.value.avatar && this.editForm.value.avatar.url
                    ? this.editForm.value.avatar.url
                    : this.user.avatarUrl
        };
        if (this.editForm.valid) {
            this.saveChanges.emit(updatedUser);
        }
    }
}
