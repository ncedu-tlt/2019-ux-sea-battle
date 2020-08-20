import { Injectable } from "@angular/core";
import { WaitingForPlacementSocket } from "../../sockets/waiting-for-placement.socket";
import { TokenService } from "../token.service";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class WaitingForPlacementWsService {
    constructor(
        private socket: WaitingForPlacementSocket,
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

    ready(): void {
        this.socket.emit("ready");
    }

    cancel(): void {
        this.socket.emit("cancel");
    }

    onConnection(): Observable<any> {
        return this.socket.fromEvent<any>("connect");
    }

    onTimer(): Observable<number> {
        return this.socket.fromEvent<number>("timer");
    }

    onConnectionError(): Observable<string> {
        return this.socket.fromEvent<string>("tokenExpired");
    }

    onReady(): Observable<any> {
        return this.socket.fromEvent("ready");
    }

    onLeave(): Observable<any> {
        return this.socket.fromEvent("leave");
    }

    onGameError(): Observable<any> {
        return this.socket.fromEvent("game-error");
    }
}
