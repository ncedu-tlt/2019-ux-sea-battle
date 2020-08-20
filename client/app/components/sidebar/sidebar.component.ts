import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Unsubscribable } from "rxjs";
import { CurrentUserService } from "./../../services/current-user.service";
import { TokenService } from "./../../services/token.service";
import { GameApiService } from "./../../services/api/game.api.service";
import { MatchmakingWsService } from "client/app/services/ws/matchmaking.ws.service";
import { WaitingForPlacementWsService } from "client/app/services/ws/waiting-for-placement.ws.service";
import { GameWsService } from "./../../services/ws/game.ws.service";
import { CurrentUserDTO } from "./../../../../dist/server/common/dto/current-user.dto.d";
import { GameDto } from "./../../../../dist/server/common/dto/game.dto.d";

@Component({
    selector: "sb-sidebar",
    templateUrl: "./sidebar.component.html"
})
export class SidebarComponent implements OnInit, OnDestroy {
    private subscriptions: Unsubscribable[] = [];
    user: CurrentUserDTO;
    game: GameDto;

    constructor(
        private tokenService: TokenService,
        private router: Router,
        private currentUserService: CurrentUserService,
        private gameService: GameApiService,
        private matchmakingService: MatchmakingWsService,
        private waitingForPlacementService: WaitingForPlacementWsService,
        private gameWsService: GameWsService
    ) {
        this.subscriptions.push(
            matchmakingService.onSearch().subscribe(() => this.updateGame()),
            gameWsService.onWin().subscribe(() => this.updateGame()),
            gameWsService.onLose().subscribe(() => this.updateGame()),
            gameWsService.onDisconnect().subscribe(() => this.updateGame()),
            waitingForPlacementService
                .onDisconnect()
                .subscribe(() => this.updateGame())
        );
    }

    ngOnInit(): void {
        this.currentUserService
            .getCurrentUser()
            .subscribe((u: CurrentUserDTO) => (this.user = u));
        this.updateGame();
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    logout(): void {
        this.tokenService.deleteToken();
        this.currentUserService.deleteCurrentUser();
        this.router.navigate(["/login"]);
    }

    surrender(): void {
        this.gameWsService.disconnect();
        this.updateGame();
    }

    updateGame(): void {
        this.gameService.getGame().subscribe((g: GameDto) => (this.game = g));
    }
}
