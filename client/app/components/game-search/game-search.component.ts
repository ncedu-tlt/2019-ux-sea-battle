import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MatchmakingService } from "../../services/ws/matchmaking.service";
import { Unsubscribable, timer, Observable } from "rxjs";
import { GameModeEnum } from "../../../../common/game-mode.enum";

@Component({
    selector: "sb-loading-screen",
    templateUrl: "./game-search.component.html",
    styleUrls: ["./game-search.component.less"]
})
export class GameSearchComponent implements OnInit, OnDestroy {
    private subscriptions: Unsubscribable[] = [];

    gameMode: GameModeEnum;
    timer: Observable<number>;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private matchmakingService: MatchmakingService
    ) {
        this.subscriptions.push(
            matchmakingService.onConnection().subscribe(() => {
                this.search();
            }),
            matchmakingService.onSearch().subscribe(() => this.onSearch())
        );
    }

    ngOnInit(): void {
        this.subscriptions.push(
            this.route.queryParams.subscribe(param => {
                this.gameMode = param.gameMode;
            })
        );
        if (!this.gameMode) {
            this.router.navigate(["/"]);
        }
        this.connection();

        this.timer = timer(0, 1000);
        this.subscriptions.push(this.timer.subscribe());
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
        this.matchmakingService.disconnect();
    }

    connection(): void {
        this.matchmakingService.connect();
    }

    search(): void {
        this.matchmakingService.search(this.gameMode);
    }

    onLeave(): void {
        this.matchmakingService.disconnect();
        this.router.navigate(["/"]);
    }

    private onSearch(): void {
        this.router.navigate(["/game"]);
    }
}
