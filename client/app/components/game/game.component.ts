import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { GameDto } from "../../../../common/dto/game.dto";
import { Unsubscribable } from "rxjs";
import { GameApiService } from "../../services/api/game.api.service";

@Component({
    selector: "sb-game",
    template: `
        {{ game | json }}
    `
})
export class GameComponent implements OnInit, OnDestroy {
    game: GameDto;

    private subscriptions: Unsubscribable[] = [];

    constructor(private gameService: GameApiService, private router: Router) {}

    ngOnInit(): void {
        this.subscriptions.push(
            this.gameService.getGame().subscribe(
                data => (this.game = data),
                () => {
                    this.router.navigate(["/menu"]);
                }
            )
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }
}
