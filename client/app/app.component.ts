import { Component, OnInit } from "@angular/core";
import { PlayersApiService } from "client/app/services/api/players.api.service";
import { Observable } from "rxjs";
import { PlayerDTO } from "common/dto/player.dto";

@Component({
    selector: "sb-root",
    template: `
        <div>{{ players$ | async | json }}</div>
        <sb-chat></sb-chat>
    `
})
export class AppComponent implements OnInit {
    players$: Observable<PlayerDTO[]>;

    constructor(private playersApiService: PlayersApiService) {}

    ngOnInit(): void {
        this.players$ = this.playersApiService.getAll();
    }
}
