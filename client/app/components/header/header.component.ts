import { Component, Output, EventEmitter } from "@angular/core";
import { UserDTO } from "common/dto/user.dto";

@Component({
    selector: "sb-header",
    templateUrl: "./header.component.html"
})
export class HeaderComponent {
    user: UserDTO;

    @Output()
    sidebarToggle = new EventEmitter();

    toggleSidebar(): void {
        this.sidebarToggle.emit();
    }
}
