import { FileModel } from "../../models/file.model";
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

    selectedAvatar: FileModel;
    onChange: (file: FileModel) => void;
    onTouched: () => void;

    writeValue(value: FileModel): void {
        this.selectedAvatar = value;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    onAvatarSelected(file: FileModel): void {
        if (file) {
            this.selectedAvatar = file;
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (): void => {
                this.selectedAvatar.url = reader.result as string;
                this.onChange(this.selectedAvatar);
                this.onTouched();
            };
        }
    }
}
