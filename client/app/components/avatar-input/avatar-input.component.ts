import { UserAvatarModel } from "./../../models/user-avatar.model";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { Component, forwardRef, Input } from "@angular/core";

@Component({
    selector: "sb-avatar-input",
    templateUrl: "./avatar-input.component.html",
    styleUrls: ["./avatar-input.component.less"],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            useExisting: forwardRef(() => AvatarInputComponent),
            multi: true
        }
    ]
})
export class AvatarInputComponent implements ControlValueAccessor {
    @Input()
    userAvatar: string;

    selectedAvatar: string;
    onChange: (file: UserAvatarModel) => void;

    writeValue(): void {
        return;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(): void {
        return;
    }

    onAvatarSelected(file: File): void {
        const avatarModel: UserAvatarModel = {
            name: file.name,
            size: file.size,
            url: null
        };

        if (file && file.size < 20000) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (): void => {
                this.selectedAvatar = avatarModel.url = reader.result as string;
                this.onChange(avatarModel);
            };
        } else {
            this.onChange(avatarModel);
        }
    }
}
