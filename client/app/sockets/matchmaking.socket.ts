import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";

@Injectable()
export class MatchmakingSocket extends Socket {
    constructor() {
        super({
            url: "/game-search",
            options: { autoConnect: false }
        });
    }
}
