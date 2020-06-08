import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { LoadingScreenService } from "./loading-screen.service";
import { MatchmakingService } from "../../services/ws/matchmaking.service";
import { Observable, Unsubscribable, timer } from "rxjs";
import { SearchDto } from "../../../../common/dto/search.dto";
import { GameModeEnum } from "../../../../common/game-mode.enum";

@Component({
    selector: "sb-loading-screen",
    templateUrl: "./loading-screen.component.html",
    styleUrls: ["./loading-screen.component.less"],
    providers: [LoadingScreenService]
})
export class LoadingScreenComponent implements OnInit, OnDestroy {
    private subscriptions: Unsubscribable[] = [];
    private userId: number;

    gameMode: string;
    isLoading = false;

    // timer
    ticks = 0;
    private timer: Observable<number>;

    constructor(
        private route: ActivatedRoute,
        private loadingScreenService: LoadingScreenService,
        private router: Router,
        private matchmakingService: MatchmakingService
    ) {
        this.subscriptions.push(
            matchmakingService.onConnection().subscribe(id => {
                this.onConnection(id);
                this.search();
            }),
            matchmakingService.onSearch().subscribe(() => this.onSearch()),
            matchmakingService.onLeave().subscribe(() => this.onLeave())
        );
    }

    ngOnInit(): void {
        this.subscriptions.push(
            this.route.queryParams.subscribe(param => {
                this.gameMode = this.loadingScreenService.getGameMode(
                    param.gameMode
                );
            })
        );
        if (!this.gameMode) {
            this.router.navigate(["/menu"]);
        }
        this.connection();

        this.timer = timer(0, 1000);
        this.subscriptions.push(this.timer.subscribe(t => (this.ticks = t)));
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
        this.matchmakingService.disconnect();
    }

    connection(): void {
        this.matchmakingService.connect();
    }

    private onConnection(id: number): void {
        this.userId = id;
    }

    search(): void {
        this.isLoading = true;
        const data: SearchDto = {
            id: this.userId,
            gameMode: GameModeEnum.CLASSIC
        };
        this.matchmakingService.search(data);
    }

    private onSearch(): void {
        this.isLoading = false;
        this.router.navigate(["/game"]);
    }

    onLeave(): void {
        this.isLoading = false;
        this.matchmakingService.disconnect();
        this.router.navigate(["/menu"]);
    }
}
