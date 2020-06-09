import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { GameDto } from "../../../../common/dto/game.dto";
import { GameApiService } from "../../services/api/game.api.service";
import { Observable } from "rxjs";

@Component({
    selector: "sb-game",
    template: `
        {{ game | async | json }}
    `
})
export class GameComponent implements OnInit {
    game: Observable<GameDto>;

    constructor(private gameService: GameApiService, private router: Router) {}

    ngOnInit(): void {
        this.game = this.gameService.getGame();
        if (!this.game) this.router.navigate(["/"]);
    }
}
