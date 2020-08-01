import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";

@Injectable()
export class WaitingForPlacementSocket extends Socket {
    constructor() {
        super({
            url: "/placement",
            options: { autoConnect: false }
        });
    }
}
