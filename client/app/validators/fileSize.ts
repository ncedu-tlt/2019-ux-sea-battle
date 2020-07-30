import { UserAvatarModel } from "./../models/user-avatar.model";
import { FormGroup } from "@angular/forms";

export function fileSize(avatarControl: string, maxSize: number) {
    return (formGroup: FormGroup): void => {
        const control = formGroup.controls[avatarControl];
        const file = control.value as File | UserAvatarModel;

        if (!file) {
            return;
        }

        if (file.size > maxSize) {
            control.setErrors({ size: true });
        }
    };
}
