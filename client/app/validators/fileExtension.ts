import { UserAvatarModel } from "./../models/user-avatar.model";
import { FormGroup } from "@angular/forms";

export function fileExtension(fileControl: string, extensions: Array<string>) {
    return (formGroup: FormGroup): void => {
        const control = formGroup.controls[fileControl];
        const file = control.value as File | UserAvatarModel;

        if (!file) {
            return;
        }

        const fileExt = file.name.split(".").pop();

        if (fileExt !== file.name) {
            if (!extensions.includes(fileExt)) {
                control.setErrors({ wrongExtension: true });
            }
        } else {
            control.setErrors({ inappropriateName: true });
        }
    };
}
