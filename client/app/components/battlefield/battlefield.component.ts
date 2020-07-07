import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output
} from "@angular/core";
import { ShipModel } from "../../models/battlefield/ship.model";
import { MoveIconDirectionEnum } from "../../models/battlefield/styles/move-icon-direction.enum";
import { ShipOrientationEnum } from "../../models/battlefield/styles/ship-orientation.enum";
import { CoordinatesModel } from "../../models/battlefield/coordinates.model";
import { MoveIconPositionEnum } from "../../models/battlefield/styles/move-icon-position.enum";
import { CellModel } from "../../models/battlefield/cell.model";
import { FieldModel } from "../../models/battlefield/field.model";

@Component({
    selector: "sb-battlefield",
    templateUrl: "./battlefield.component.html",
    styleUrls: ["./battlefield.component.less"]
})
export class BattlefieldComponent implements OnChanges {
    @Input()
    size: number;

    @Input()
    fieldCells: CellModel[];

    @Input()
    ships: ShipModel[];

    @Output()
    cellSelection = new EventEmitter<CoordinatesModel>();

    field: FieldModel[][];

    ngOnChanges(): void {
        this.field = new Array(this.size);
        for (let i = 0; i < this.field.length; i++) {
            this.field[i] = new Array(this.size);
        }
        this.fieldCells.forEach(cell => (this.field[cell.y][cell.x] = cell));
        this.ships.forEach(ship => {
            ship.cells.forEach(
                cell =>
                    (this.field[cell.y][cell.x] = {
                        cellParams: cell,
                        team: ship.team,
                        isSelected: ship.isSelected,
                        movingIconLocation: this.shipMovingIconStyles(ship)
                    })
            );
        });
    }

    onClick(x: number, y: number): void {
        const coordinates: CoordinatesModel = { x, y };
        this.cellSelection.emit(coordinates);
    }

    shipMovingIconStyles(ship: ShipModel): string {
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

    private borderCheck(ship: ShipModel): MoveIconDirectionEnum {
        if (this.isVertical(ship) && ship.cells.length !== 1) {
            if (ship.cells[0].y === 0) {
                if (ship.cells[0].x === 0) {
                    return MoveIconDirectionEnum.RIGHT;
                } else {
                    return MoveIconDirectionEnum.LEFT;
                }
            } else {
                return MoveIconDirectionEnum.TOP;
            }
        } else {
            if (ship.cells[0].y === 0) {
                return MoveIconDirectionEnum.BOTTOM;
            } else {
                return MoveIconDirectionEnum.TOP;
            }
        }
    }

    private isVertical(ship: ShipModel): boolean {
        return ship.cells.every(cell => cell.x === ship.cells[0].x);
    }
}
