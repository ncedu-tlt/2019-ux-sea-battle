import { Component, OnInit } from "@angular/core";
import { PlayersApiService } from "client/app/services/api/players.api.service";
import { Observable } from "rxjs";
import { PlayerDTO } from "common/dto/player.dto";

@Component({
    selector: "sb-root",
    template: `
        {{ players$ | async | json }}
    `
})
export class AppComponent implements OnInit {
    players$: Observable<PlayerDTO[]>;

    constructor(private playersApiService: PlayersApiService) {}

    ngOnInit(): void {
        this.players$ = this.playersApiService.getAll();
    }
}
