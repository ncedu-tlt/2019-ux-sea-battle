import { Injectable } from "@angular/core";
import { MatchmakingSocket } from "../../sockets/matchmaking.socket";
import { Observable } from "rxjs";
import { TokenService } from "../token.service";
import { GameModeEnum } from "../../../../common/game-mode.enum";

@Injectable({
    providedIn: "root"
})
export class MatchmakingService {
    constructor(
        private socket: MatchmakingSocket,
        private tokenService: TokenService
    ) {}

    connect(): void {
        this.socket.ioSocket.query = {
            token: this.tokenService.getToken()
        };
        this.socket.connect();
    }

    disconnect(): void {
        this.socket.disconnect();
    }

    search(gameMode: GameModeEnum): void {
        this.socket.emit("search", gameMode);
    }

    onSearch(): Observable<number> {
        return this.socket.fromEvent<number>("search");
    }

    onConnection(): Observable<number> {
        return this.socket.fromEvent<number>("connect");
    }

    onDisconnect(): Observable<any> {
        return this.socket.fromEvent<any>("disconnect");
    }
}
