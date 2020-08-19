import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { GameDto } from "../../../../common/dto/game.dto";
import { GameApiService } from "../../services/api/game.api.service";
import { Observable, timer, Unsubscribable } from "rxjs";
import { ShipModel } from "../../../../common/models/ship/ship.model";
import { TokenService } from "../../services/token.service";
import { GameWsService } from "../../services/ws/game.ws.service";
import { CellModel } from "../../../../common/models/cell.model";
import { PlayerFieldDto } from "../../../../common/dto/player-field.dto";
import { TurnDto } from "../../../../common/dto/turn.dto";
import { CoordinatesModel } from "../../../../common/models/ship/coordinates.model";
import { PlayerStatusEnum } from "../../models/game/player-status.enum";

@Component({
    selector: "sb-game",
    templateUrl: "game.component.html",
    styleUrls: ["./game.component.less"]
})
export class GameComponent implements OnInit, OnDestroy {
    game: Observable<GameDto>;

    size = 10;
    ships: ShipModel[];
    cells: CellModel[] = [];

    isPlayerTurn = false;
    playerNickname: string;
    timer: number;
    leaving = false;
    leavingTimer = 10;
    playerStatus = PlayerStatusEnum.NONE;

    private subscriptions: Unsubscribable[] = [];
    private timerSubscription: Unsubscribable;

    constructor(
        private gameService: GameApiService,
        private router: Router,
        private tokenService: TokenService,
        private gameWsService: GameWsService
    ) {
        this.subscriptions.push(
            this.gameWsService.onConnection().subscribe(() => this.start()),
            this.gameWsService.onConnectionError().subscribe(() => {
                this.tokenService.deleteToken();
                this.router.navigate(["/login"]);
            }),
            this.gameWsService.onGameError().subscribe(() => this.leave()),
            this.gameWsService.onLeave().subscribe(() => this.onLeave()),
            this.gameWsService.onWin().subscribe((turn: TurnDto) => {
                this.playerStatus = PlayerStatusEnum.WINNER;
                this.turnInit(turn);
                this.onEndGame();
            }),
            this.gameWsService.onLose().subscribe((turn: TurnDto) => {
                this.playerStatus = PlayerStatusEnum.LOSER;
                this.turnInit(turn);
                this.onEndGame();
            }),
            this.gameWsService
                .onTurn()
                .subscribe((turn: TurnDto) => this.turn(turn)),
            this.gameWsService
                .onWaiting()
                .subscribe((turn: TurnDto) => this.waiting(turn))
        );
    }

    ngOnInit(): void {
        this.game = this.gameService.getGame();
        if (!this.game) {
            this.router.navigate(["/"]);
        }
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                this.cells.push({
                    x: i,
                    y: j,
                    hit: false,
                    selectedToFire: false
                });
            }
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
        this.gameWsService.disconnect();
    }

    onSelectCell(battlefieldCell: CoordinatesModel): void {
        this.cells.forEach(cell => (cell.selectedToFire = false));
        this.ships.forEach(ship =>
            ship.cells.forEach(cell => (cell.selectedToFire = false))
        );
        const cell: CellModel = this.cells.find(
            cell => cell.x === battlefieldCell.x && cell.y === battlefieldCell.y
        );
        const ship: ShipModel = this.ships.find(ship =>
            ship.cells.find(
                cell =>
                    cell.x === battlefieldCell.x && cell.y === battlefieldCell.y
            )
        );
        if (ship) {
            ship.cells.find(
                cell =>
                    cell.x === battlefieldCell.x && cell.y === battlefieldCell.y
            ).selectedToFire = true;
            this.ships = [...this.ships];
        } else {
            cell.selectedToFire = true;
        }
    }

    onFire(): void {
        const cell: CellModel = this.cells.find(cell => cell.selectedToFire);
        const ship: ShipModel = this.ships.find(ship =>
            ship.cells.find(cell => cell.selectedToFire)
        );
        let coordinates: CoordinatesModel;
        if (cell) {
            coordinates = { x: cell.x, y: cell.y };
        } else {
            if (ship) {
                const shipCellIndex: number = ship.cells.findIndex(
                    cell => cell.selectedToFire
                );
                coordinates = {
                    x: ship.cells[shipCellIndex].x,
                    y: ship.cells[shipCellIndex].y
                };
            }
        }
        if (this.isPlayerTurn && (cell || ship)) {
            this.gameWsService.turn(coordinates);
        }
    }

    onReady(ships: ShipModel[]): void {
        this.ships = ships;
        this.gameWsService.connect();
    }

    start(): void {
        const field: PlayerFieldDto = {
            ships: this.ships,
            cells: this.cells
        };
        this.gameWsService.start(field);
    }

    continue(): void {
        this.gameWsService.disconnect();
        this.router.navigate(["/"]);
    }

    private onLeave(): void {
        this.leaving = true;
        this.gameWsService.disconnect();
    }

    private waiting(turnDto: TurnDto): void {
        this.turnInit(turnDto);
        this.timerSubscription = timer(0, 1000).subscribe(() =>
            this.timer > 0 && !this.leaving ? this.timer-- : this.timer
        );
    }

    private turn(turnDto: TurnDto): void {
        this.turnInit(turnDto);
        this.timerSubscription = timer(0, 1000).subscribe(() =>
            this.timer > 0 && !this.leaving
                ? this.timer--
                : this.leaving
                ? this.timer
                : this.timeUp()
        );
    }

    private timeUp(): void {
        if (this.timer === 0) {
            this.gameWsService.skip();
        }
    }

    private leave(): void {
        this.router.navigate(["/"]);
    }

    private turnInit(turnDto: TurnDto): void {
        if (this.timerSubscription) {
            this.timerSubscription.unsubscribe();
        }
        this.cells = turnDto.cells;
        this.ships = turnDto.ships;
        this.playerNickname = turnDto.name;
        this.timer = turnDto.timer;
        this.isPlayerTurn = turnDto.isWaiting;
        this.cells.forEach(cell => (cell.selectedToFire = false));
        this.ships.forEach(ship =>
            ship.cells.forEach(cell => (cell.selectedToFire = false))
        );
    }

    private onEndGame(): void {
        this.timerSubscription.unsubscribe();
        this.cells.forEach(cell => (cell.selectedToFire = false));
        this.ships.forEach(ship =>
            ship.cells.forEach(cell => (cell.selectedToFire = false))
        );
    }
}
