import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ShipModel } from "../../models/battlefield/ship.model";
import { MoveIconDirectionEnum } from "../../models/battlefield/styles/move-icon-direction.enum";
import { ShipOrientationEnum } from "../../models/battlefield/styles/ship-orientation.enum";
import { CoordinatesModel } from "../../models/battlefield/coordinates.model";
import { MoveIconPositionEnum } from "../../models/battlefield/styles/move-icon-position.enum";
import { CellModel } from "../../models/battlefield/cell.model";

@Component({
    selector: "sb-battlefield",
    templateUrl: "./battlefield.component.html",
    styleUrls: ["./battlefield.component.less"]
})
export class BattlefieldComponent {
    @Input()
    size: number;

    @Input()
    fieldCells: CellModel[];

    @Input()
    ships: ShipModel[];

    @Output()
    coordinates = new EventEmitter<CoordinatesModel>();

    battlefield(size: number): Array<any> {
        return new Array<any>(size);
    }

    onClick(X: number, Y: number): void {
        const coordinates: CoordinatesModel = { X, Y };
        this.coordinates.emit(coordinates);
    }

    shipMovingIconStyles(X: number, Y: number): string {
        const ship: ShipModel = this.getShip(X, Y);

        const orientation: ShipOrientationEnum = this.isVertical(ship)
            ? ShipOrientationEnum.VERTICAL
            : ShipOrientationEnum.HORIZONTAL;

        const direction: MoveIconDirectionEnum = this.borderCheck(ship);

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

    getShip(X: number, Y: number): ShipModel {
        return this.ships.find(ship =>
            ship.cells.find(
                coordinates => coordinates.X === X && coordinates.Y === Y
            )
        );
    }

    getShipCellIndex(X: number, Y: number): number {
        const ship: ShipModel = this.getShip(X, Y);
        return ship.cells.findIndex(cell => cell.X === X && cell.Y === Y);
    }

    getCell(X: number, Y: number): CellModel {
        return this.fieldCells.find(
            cell => cell.coordinates.X === X && cell.coordinates.Y === Y
        );
    }

    private borderCheck(ship: ShipModel): MoveIconDirectionEnum {
        if (this.isVertical(ship) && ship.cells.length !== 1) {
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

    private isVertical(ship: ShipModel): boolean {
        return ship.cells.every(cell => cell.X === ship.cells[0].X);
    }
}
