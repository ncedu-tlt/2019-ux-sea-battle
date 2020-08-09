import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";

@Injectable()
export class GameSocket extends Socket {
    constructor() {
        super({
            url: "/game",
            options: { autoConnect: false }
        });
    }
}
