import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { GameDto } from "../../../../common/dto/game.dto";
import { GameApiService } from "../../services/api/game.api.service";
import { Observable, Unsubscribable } from "rxjs";
import { ShipModel } from "../../../../common/models/ship/ship.model";
import { TokenService } from "../../services/token.service";
import { GameWsService } from "../../services/ws/game.ws.service";
import { CellModel } from "../../../../common/models/cell.model";
import { PlayerFieldDto } from "../../../../common/dto/player-field.dto";

@Component({
    selector: "sb-game",
    templateUrl: "game.component.html"
})
export class GameComponent implements OnInit, OnDestroy {
    game: Observable<GameDto>;

    size = 10;
    ships: ShipModel[];
    cells: CellModel[] = [];

    private subscriptions: Unsubscribable[] = [];

    constructor(
        private gameService: GameApiService,
        private router: Router,
        private tokenService: TokenService,
        private gameWsService: GameWsService
    ) {
        this.subscriptions.push(
            this.gameWsService.onConnection().subscribe(() => this.start())
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
                    hit: false
                });
            }
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
        this.gameWsService.disconnect();
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

    onLeave(): void {
        this.router.navigate(["/"]);
    }
}
