import { Injectable } from "@angular/core";
import { MatchmakingSocket } from "../../sockets/matchmaking.socket";
import { Observable } from "rxjs";
import { SearchDto } from "../../../../common/dto/search.dto";
import { TokenService } from "../token.service";

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

    search(data: SearchDto): void {
        this.socket.emit("search", data);
    }

    onSearch(): Observable<number> {
        return this.socket.fromEvent<number>("search");
    }

    onConnection(): Observable<number> {
        return this.socket.fromEvent<number>("connection");
    }

    onLeave(): Observable<string> {
        return this.socket.fromEvent<string>("leave");
    }
}
