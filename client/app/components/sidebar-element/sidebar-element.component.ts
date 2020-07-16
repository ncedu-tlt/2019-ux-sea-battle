import { Component, Input } from "@angular/core";

@Component({
    selector: "sb-sidebar-element",
    templateUrl: "./sidebar-element.component.html"
})
export class SidebarElementComponent {
    @Input()
    itemImageLink: string;

    @Input()
    itemLabel: string;

    @Input()
    isLink: boolean;

    @Input()
    itemLink: string;
}
