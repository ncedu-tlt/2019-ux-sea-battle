import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Unsubscribable } from "rxjs";
import { CurrentUserService } from "./../../services/current-user.service";
import { TokenService } from "./../../services/token.service";
import { GameApiService } from "./../../services/api/game.api.service";
import { MatchmakingWsService } from "client/app/services/ws/matchmaking.ws.service";
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
        private matchmakingService: MatchmakingWsService
    ) {
        this.subscriptions.push(
            matchmakingService.onSearch().subscribe(() => this.updateGame())
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

    updateGame(): void {
        this.gameService.getGame().subscribe((g: GameDto) => (this.game = g));
    }
}
