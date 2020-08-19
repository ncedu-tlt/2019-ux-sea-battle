import { Injectable } from "@angular/core";
import { TokenService } from "../token.service";
import { GameSocket } from "../../sockets/game.socket";
import { Observable } from "rxjs";
import { PlayerFieldDto } from "../../../../common/dto/player-field.dto";
import { ShipModel } from "../../../../common/models/ship/ship.model";
import { CellModel } from "../../../../common/models/cell.model";
import { TurnDto } from "../../../../common/dto/turn.dto";
import { CoordinatesModel } from "../../../../common/models/ship/coordinates.model";

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

    start(field: PlayerFieldDto): void {
        this.socket.emit("start", field);
    }

    turn(coordinates: CoordinatesModel): void {
        this.socket.emit("turn", coordinates);
    }

    skip(): void {
        this.socket.emit("skip");
    }

    onConnection(): Observable<number> {
        return this.socket.fromEvent<number>("connect");
    }

    onWaiting(): Observable<TurnDto> {
        return this.socket.fromEvent<TurnDto>("waiting");
    }

    onTurn(): Observable<TurnDto> {
        return this.socket.fromEvent<TurnDto>("turn");
    }

    onHit(): Observable<ShipModel[]> {
        return this.socket.fromEvent<ShipModel[]>("hit");
    }

    onMiss(): Observable<CellModel[]> {
        return this.socket.fromEvent<CellModel[]>("miss");
    }

    onWin(): Observable<TurnDto> {
        return this.socket.fromEvent<TurnDto>("win");
    }

    onLose(): Observable<TurnDto> {
        return this.socket.fromEvent<TurnDto>("lose");
    }

    onGameError(): Observable<any> {
        return this.socket.fromEvent("game-error");
    }

    onConnectionError(): Observable<string> {
        return this.socket.fromEvent<string>("tokenExpired");
    }

    onLeave(): Observable<any> {
        return this.socket.fromEvent("leave");
    }
}
