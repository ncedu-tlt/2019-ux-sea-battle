import { Injectable } from "@angular/core";
import { TokenService } from "../token.service";
import { GameSocket } from "../../sockets/game.socket";
import { ShipModel } from "../../../../common/models/ship/ship.model";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class GameWsService {
    constructor(
        private socket: GameSocket,
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

    getShips(): void {
        this.socket.emit("get-ships");
    }

    start(ships: ShipModel[]): void {
        this.socket.emit("start", ships);
    }

    onConnection(): Observable<number> {
        return this.socket.fromEvent<number>("connect");
    }

    onGettingShips(): Observable<ShipModel[]> {
        return this.socket.fromEvent<ShipModel[]>("getting-ships");
    }

    onStart(): Observable<any> {
        return this.socket.fromEvent("start");
    }

    onConnectionError(): Observable<string> {
        return this.socket.fromEvent<string>("tokenExpired");
    }
}
