import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output
} from "@angular/core";
import { CellModel } from "../../models/battlefield/cell.model";
import { CoordinatesModel } from "../../../../common/models/ship/coordinates.model";
import { ShipModel } from "../../../../common/models/ship/ship.model";
import { ShipLayoutModel } from "../../models/ships-placement/ship-layout.model";
import { TeamEnum } from "../../../../common/models/ship/team.enum";
import { ShipsTypeEnum } from "../../models/ships-placement/ships-type.enum";
import { ShipsPlacementService } from "./ships-placement.service";
import { ShipStateEnum } from "../../../../common/models/ship/ship-state.enum";
import { WaitingForPlacementWsService } from "../../services/ws/waiting-for-placement.ws.service";
import { timer, Unsubscribable } from "rxjs";
import { Router } from "@angular/router";
import { TokenService } from "../../services/token.service";

@Component({
    selector: "sb-ships-placement",
    templateUrl: "./ships-placement.component.html",
    styleUrls: ["./ships-placement.component.less"],
    providers: [ShipsPlacementService]
})
export class ShipsPlacementComponent implements OnInit, OnDestroy {
    @Input()
    size: number;

    @Output()
    shipsOnField = new EventEmitter<ShipModel[]>();

    ships: ShipModel[] = [];
    cells: CellModel[] = [];

    shipsLayout: ShipLayoutModel[] = ShipsPlacementComponent.initShips();

    isReady = false;
    timer: number;
    leavingTimer = 10;
    leaving = false;

    private timerSubscription: Unsubscribable;
    private subscriptions: Unsubscribable[] = [];

    constructor(
        private shipsPlacementService: ShipsPlacementService,
        private waitingForPlacementService: WaitingForPlacementWsService,
        private router: Router,
        private tokenService: TokenService
    ) {
        this.subscriptions.push(
            this.waitingForPlacementService
                .onConnection()
                .subscribe(() => this.waitingForPlacementService.getTimer()),
            this.waitingForPlacementService.onTimer().subscribe(time => {
                if (!this.timer) {
                    this.timer = time;
                    this.timerSubscription = timer(0, 1000).subscribe(() =>
                        this.timer > 0 && !this.leaving
                            ? this.timer--
                            : this.leaving
                            ? this.timer
                            : this.timeUp()
                    );
                }
            }),
            this.waitingForPlacementService
                .onReady()
                .subscribe(() => this.onReady()),
            this.waitingForPlacementService
                .onLeave()
                .subscribe(() => this.onLeave()),
            this.waitingForPlacementService
                .onConnectionError()
                .subscribe(() => {
                    this.tokenService.deleteToken();
                    this.router.navigate(["/login"]);
                })
        );
    }

    ngOnInit(): void {
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                this.cells.push({
                    x: i,
                    y: j,
                    hit: false
                });
            }
        }
        this.connection();
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
        this.timerSubscription.unsubscribe();
        this.waitingForPlacementService.disconnect();
    }

    onClickCell(battlefieldCell: CoordinatesModel): void {
        const ship: ShipModel = this.ships.find(ship =>
            ship.cells.find(
                cell =>
                    cell.x === battlefieldCell.x && cell.y === battlefieldCell.y
            )
        );
        if (ship) {
            this.shipsLayout.forEach(ship => (ship.isSelected = false));
            if (ship.isSelected) {
                ship.isSelected = false;
            } else {
                this.ships.forEach(ship => (ship.isSelected = false));
                ship.isSelected = true;
            }
            const i = this.ships.findIndex(ship =>
                ship.cells.find(
                    cell =>
                        cell.x === battlefieldCell.x &&
                        cell.y === battlefieldCell.y
                )
            );
            this.ships[i] = ship;
            this.ships = [...this.ships];
        } else {
            // ship placing
            const layoutShip: ShipLayoutModel = this.shipsLayout.find(
                ship => ship.isSelected
            );
            if (layoutShip) {
                const ship: ShipModel = {
                    cells: [],
                    isSelected: false,
                    team: TeamEnum.GREEN
                };
                const newShipCoordinates: CoordinatesModel[] = this.shipsPlacementService.horizontalPlacement(
                    battlefieldCell,
                    layoutShip.type,
                    this.size,
                    this.ships
                );
                if (newShipCoordinates) {
                    newShipCoordinates.forEach(cell => {
                        ship.cells.push({
                            x: cell.x,
                            y: cell.y,
                            state: ShipStateEnum.NORMAL
                        });
                    });
                    this.ships = [...this.ships, ship];
                    this.shipsLayout.find(ship => ship.isSelected).count--;
                }
                this.shipsLayout.forEach(ship => (ship.isSelected = false));
            }
            // move ship
            const selectedShip: ShipModel = this.ships.find(
                ship => ship.isSelected
            );
            if (selectedShip) {
                const type: ShipsTypeEnum = this.shipsPlacementService.getShipType(
                    selectedShip.cells
                );
                // horizontal / vertical
                let newShipCoordinates: CoordinatesModel[];
                if (!this.shipsPlacementService.isVertical(selectedShip)) {
                    newShipCoordinates = this.shipsPlacementService.horizontalPlacement(
                        battlefieldCell,
                        type,
                        this.size,
                        this.ships.filter(ship => !ship.isSelected)
                    );
                } else {
                    newShipCoordinates = this.shipsPlacementService.verticalPlacement(
                        battlefieldCell,
                        this.size,
                        this.ships.filter(ship => !ship.isSelected),
                        type
                    );
                }
                if (newShipCoordinates) {
                    selectedShip.cells = [];
                    newShipCoordinates.forEach(cell => {
                        selectedShip.cells.push({
                            x: cell.x,
                            y: cell.y,
                            state: ShipStateEnum.NORMAL
                        });
                    });
                    selectedShip.isSelected = false;
                    const i = this.ships.findIndex(ship => ship.isSelected);
                    this.ships[i] = selectedShip;
                    this.ships = [...this.ships];
                }
            }
        }
    }

    onClickShip(type: ShipsTypeEnum): void {
        this.ships.forEach(ship => (ship.isSelected = false));
        this.ships = [...this.ships];
        for (let i = 0; i < this.shipsLayout.length; i++) {
            if (this.shipsLayout[i].type === type) {
                this.shipsLayout[i].isSelected = !this.shipsLayout[i]
                    .isSelected;
            } else {
                this.shipsLayout[i].isSelected = false;
            }
        }
    }

    onIconClick(battlefieldCell: CoordinatesModel): void {
        const ship: ShipModel = this.ships.find(ship =>
            ship.cells.find(
                cell =>
                    cell.x === battlefieldCell.x && cell.y === battlefieldCell.y
            )
        );
        this.shipsPlacementService.shipOrientationChange(
            ship.cells.length >= 3
                ? { x: ship.cells[1].x, y: ship.cells[1].y }
                : battlefieldCell,
            this.size,
            this.ships.filter(ship => !ship.isSelected),
            ship
        );
        const i: number = this.ships.findIndex(ship =>
            ship.cells.find(
                cell =>
                    cell.x === battlefieldCell.x && cell.y === battlefieldCell.y
            )
        );
        this.ships.forEach(ship => (ship.isSelected = false));
        this.ships[i] = ship;
        this.ships = [...this.ships];
    }

    onQuickPlacement(): void {
        this.ships = [];
        this.shipsLayout = ShipsPlacementComponent.initShips();
        this.shipsLayout.forEach(ship => {
            while (ship.count >= 1) {
                this.ships.push(
                    this.shipsPlacementService.quickPlacement(
                        this.ships,
                        ship.type,
                        this.size
                    )
                );
                ship.count--;
            }
        });
        this.ships = [...this.ships];
    }

    ready(): void {
        this.isReady = !this.isReady;
        if (this.isReady) {
            this.ships.forEach(ship => (ship.isSelected = false));
            this.ships = [...this.ships];
            this.waitingForPlacementService.ready();
        } else {
            this.waitingForPlacementService.cancel();
        }
    }

    onLeave(): void {
        this.leaving = true;
        this.subscriptions.push(
            timer(0, 1000).subscribe(() =>
                this.leavingTimer > 0 ? this.leavingTimer-- : this.leave()
            )
        );
    }

    onReady(): void {
        this.shipsOnField.emit(this.ships);
    }

    private connection(): void {
        this.waitingForPlacementService.connect();
    }

    private leave(): void {
        this.router.navigate(["/"]);
    }

    private timeUp(): void {
        if (this.shipsLayout.every(ship => ship.count > 0)) {
            this.onQuickPlacement();
        }
        this.waitingForPlacementService.ready();
    }

    private static initShips(): ShipLayoutModel[] {
        return [
            {
                color: TeamEnum.GREEN,
                type: ShipsTypeEnum.BATTLESHIP,
                count: 1,
                isSelected: false
            },
            {
                color: TeamEnum.GREEN,
                type: ShipsTypeEnum.CRUISER,
                count: 2,
                isSelected: false
            },
            {
                color: TeamEnum.GREEN,
                type: ShipsTypeEnum.DESTROYER,
                count: 3,
                isSelected: false
            },
            {
                color: TeamEnum.GREEN,
                type: ShipsTypeEnum.BOAT,
                count: 4,
                isSelected: false
            }
        ];
    }
}
