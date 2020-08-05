import { Component, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { GameDto } from "../../../../common/dto/game.dto";
import { GameApiService } from "../../services/api/game.api.service";
import { Observable, Unsubscribable } from "rxjs";
import { ShipModel } from "../../../../common/models/ship/ship.model";
import { TokenService } from "../../services/token.service";
import { GameWsService } from "../../services/ws/game.ws.service";

@Component({
    selector: "sb-game",
    templateUrl: "game.component.html"
})
export class GameComponent implements OnDestroy {
    game: Observable<GameDto>;

    size = 10;
    ships: ShipModel[];

    private subscriptions: Unsubscribable[] = [];

    constructor(
        private gameService: GameApiService,
        private router: Router,
        private tokenService: TokenService,
        private gameWsService: GameWsService
    ) {
        this.subscriptions.push(
            this.gameWsService.onConnection().subscribe(() => this.start()),
            this.gameWsService.onStart().subscribe(() => {
                this.game = this.gameService.getGame();
                if (!this.game) {
                    this.router.navigate(["/"]);
                }
            })
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
        this.gameWsService.disconnect();
    }

    onReady(ships: ShipModel[]): void {
        this.ships = [...ships];
        this.gameWsService.connect();
    }

    getShips(): void {
        this.gameWsService.getShips();
    }

    start(): void {
        this.gameWsService.start(this.ships);
    }

    onLeave(): void {
        this.router.navigate(["/"]);
    }
}
