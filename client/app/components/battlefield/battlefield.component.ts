import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CellModel } from "../../models/battlefield/cell.model";
import { CellStateEnum } from "../../models/battlefield/cell-state.enum";
import { ShipModel } from "../../models/battlefield/ship.model";
import { MoveIconDirectionEnum } from "../../models/battlefield/styles/move-icon-direction.enum";
import { ShipOrientationEnum } from "../../models/battlefield/styles/ship-orientation.enum";
import { CoordinatesModel } from "../../models/battlefield/coordinates.model";
import { MoveIconPositionEnum } from "../../models/battlefield/styles/move-icon-position.enum";

@Component({
    selector: "sb-battlefield",
    templateUrl: "./battlefield.component.html",
    styleUrls: ["./battlefield.component.less"]
})
export class BattlefieldComponent implements OnInit {
    @Input()
    battlefield: CellModel[][];

    @Input()
    ships: ShipModel[];

    @Output()
    coordinates = new EventEmitter<CoordinatesModel>();

    ngOnInit(): void {
        for (const ship of this.ships) {
            for (const coordinates of ship.cells) {
                this.battlefield[coordinates.Y][coordinates.X].state =
                    CellStateEnum.SHIP;
            }
        }
    }

    onClick(X: number, Y: number): void {
        const coordinates: CoordinatesModel = { X, Y };
        this.coordinates.emit(coordinates);
    }

    movingIconStyles(X: number, Y: number): string {
        const ship: ShipModel = this.getShip(X, Y);

        const orientation: ShipOrientationEnum = ship.isVertical
            ? ShipOrientationEnum.VERTICAL
            : ShipOrientationEnum.HORIZONTAL;

        const direction: MoveIconDirectionEnum = BattlefieldComponent.borderCheck(
            ship
        );

        let position: MoveIconPositionEnum;
        switch (ship.cells.length) {
            case 1: {
                position = MoveIconPositionEnum.CENTER;
                break;
            }
            case 2: {
                position = MoveIconPositionEnum.BESIDE;
                break;
            }
            case 3: {
                position = MoveIconPositionEnum.SIDE;
                break;
            }
            case 4: {
                position = MoveIconPositionEnum.FAR;
            }
        }
        return `${orientation} ${direction} ${position}`;
    }

    private static borderCheck(ship: ShipModel): MoveIconDirectionEnum {
        if (ship.isVertical && ship.cells.length !== 1) {
            if (ship.cells[0].Y === 0) {
                if (ship.cells[0].X === 0) {
                    return MoveIconDirectionEnum.RIGHT;
                } else {
                    return MoveIconDirectionEnum.LEFT;
                }
            } else {
                return MoveIconDirectionEnum.TOP;
            }
        } else {
            if (ship.cells[0].Y === 0) {
                return MoveIconDirectionEnum.BOTTOM;
            } else {
                return MoveIconDirectionEnum.TOP;
            }
        }
    }

    getShip(X: number, Y: number): ShipModel {
        return this.ships.find(ship =>
            ship.cells.find(
                coordinates => coordinates.X === X && coordinates.Y === Y
            )
        );
    }

    getShipCellIndex(X: number, Y: number): number {
        const ship: ShipModel = this.ships.find(ship =>
            ship.cells.find(cell => cell.X === X && cell.Y === Y)
        );

        return ship.cells.findIndex(cell => cell.X === X && cell.Y === Y);
    }
}
