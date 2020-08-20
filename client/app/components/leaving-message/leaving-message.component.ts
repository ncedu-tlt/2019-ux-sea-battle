import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { timer, Unsubscribable } from "rxjs";
import { Router } from "@angular/router";

@Component({
    selector: "sb-leaving-message",
    templateUrl: "./leaving-message.component.html",
    styleUrls: ["./leaving-message.component.less"]
})
export class LeavingMessageComponent implements OnInit, OnDestroy {
    @Input()
    leavingTimer: number;

    private timerSubscription: Unsubscribable;

    constructor(private router: Router) {}

    ngOnInit(): void {
        this.timerSubscription = timer(0, 1000).subscribe(() =>
            this.leavingTimer > 0 ? this.leavingTimer-- : this.leave()
        );
    }

    ngOnDestroy(): void {
        this.timerSubscription.unsubscribe();
    }

    private leave(): void {
        this.router.navigate(["/"]);
    }
}
