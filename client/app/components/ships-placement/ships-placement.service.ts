import { Injectable } from "@angular/core";
import { ShipsTypeEnum } from "../../models/ships-placement/ships-type.enum";
import { ShipModel } from "../../../../common/models/ship/ship.model";
import { CoordinatesModel } from "../../../../common/models/ship/coordinates.model";
import { ShipStateEnum } from "../../../../common/models/ship/ship-state.enum";
import { TeamEnum } from "../../../../common/models/ship/team.enum";

@Injectable()
export class ShipsPlacementService {
    horizontalPlacement(
        coordinates: CoordinatesModel,
        type: ShipsTypeEnum,
        size: number,
        ships: ShipModel[]
    ): CoordinatesModel[] {
        const shipCoordinates: CoordinatesModel[] = [];
        switch (coordinates.x) {
            case 0: {
                this.startOfFieldCase(
                    type,
                    coordinates,
                    shipCoordinates,
                    ships,
                    false
                );
                break;
            }
            case size - 1: {
                this.endOfFieldCase(
                    size,
                    type,
                    coordinates,
                    shipCoordinates,
                    ships,
                    false
                );
                break;
            }
            default: {
                switch (type) {
                    case ShipsTypeEnum.BOAT: {
                        if (
                            ships.every(ship =>
                                ship.cells.every(cell =>
                                    this.cellCheck(cell, coordinates)
                                )
                            )
                        ) {
                            shipCoordinates.push({
                                x: coordinates.x,
                                y: coordinates.y
                            });
                        }
                        break;
                    }
                    case ShipsTypeEnum.DESTROYER: {
                        if (
                            ships.every(ship =>
                                ship.cells.every(
                                    cell =>
                                        this.cellCheck(cell, coordinates) &&
                                        this.cellCheck(cell, {
                                            x: coordinates.x + 1,
                                            y: coordinates.y
                                        })
                                )
                            )
                        ) {
                            shipCoordinates.push(
                                {
                                    x: coordinates.x,
                                    y: coordinates.y
                                },
                                {
                                    x: coordinates.x + 1,
                                    y: coordinates.y
                                }
                            );
                        }
                        break;
                    }
                    case ShipsTypeEnum.CRUISER: {
                        if (
                            ships.every(ship =>
                                ship.cells.every(
                                    cell =>
                                        this.cellCheck(cell, {
                                            x: coordinates.x - 1,
                                            y: coordinates.y
                                        }) &&
                                        this.cellCheck(cell, coordinates) &&
                                        this.cellCheck(cell, {
                                            x: coordinates.x + 1,
                                            y: coordinates.y
                                        })
                                )
                            )
                        ) {
                            shipCoordinates.push(
                                {
                                    x: coordinates.x - 1,
                                    y: coordinates.y
                                },
                                {
                                    x: coordinates.x,
                                    y: coordinates.y
                                },
                                {
                                    x: coordinates.x + 1,
                                    y: coordinates.y
                                }
                            );
                        }
                        break;
                    }
                    case ShipsTypeEnum.BATTLESHIP: {
                        if (coordinates.x === size - 2) {
                            this.endOfFieldCase(
                                size,
                                type,
                                coordinates,
                                shipCoordinates,
                                ships,
                                false
                            );
                        } else {
                            if (
                                ships.every(ship =>
                                    ship.cells.every(
                                        cell =>
                                            this.cellCheck(cell, {
                                                x: coordinates.x - 1,
                                                y: coordinates.y
                                            }) &&
                                            this.cellCheck(cell, coordinates) &&
                                            this.cellCheck(cell, {
                                                x: coordinates.x + 1,
                                                y: coordinates.y
                                            }) &&
                                            this.cellCheck(cell, {
                                                x: coordinates.x + 2,
                                                y: coordinates.y
                                            })
                                    )
                                )
                            ) {
                                shipCoordinates.push(
                                    {
                                        x: coordinates.x - 1,
                                        y: coordinates.y
                                    },
                                    {
                                        x: coordinates.x,
                                        y: coordinates.y
                                    },
                                    {
                                        x: coordinates.x + 1,
                                        y: coordinates.y
                                    },
                                    {
                                        x: coordinates.x + 2,
                                        y: coordinates.y
                                    }
                                );
                            }
                        }
                        break;
                    }
                }
                break;
            }
        }
        if (shipCoordinates.length === this.getShipSize(type)) {
            return shipCoordinates;
        }
    }

    shipOrientationChange(
        coordinates: CoordinatesModel,
        size: number,
        ships: ShipModel[],
        ship: ShipModel
    ): void {
        let shipCoordinates: CoordinatesModel[];
        if (this.isVertical(ship)) {
            shipCoordinates = this.horizontalPlacement(
                coordinates,
                this.getShipType(ship.cells),
                size,
                ships
            );
        } else {
            shipCoordinates = this.verticalPlacement(
                coordinates,
                size,
                ships,
                this.getShipType(ship.cells)
            );
        }
        if (shipCoordinates) {
            ship.cells = [];
            shipCoordinates.forEach(cell => {
                ship.cells.push({
                    x: cell.x,
                    y: cell.y,
                    state: ShipStateEnum.NORMAL,
                    selectedToFire: false
                });
            });
        }
    }

    verticalPlacement(
        coordinates: CoordinatesModel,
        size: number,
        ships: ShipModel[],
        type: ShipsTypeEnum
    ): CoordinatesModel[] {
        const shipCoordinates: CoordinatesModel[] = [];
        switch (coordinates.y) {
            case 0: {
                this.startOfFieldCase(
                    type,
                    coordinates,
                    shipCoordinates,
                    ships,
                    true
                );
                break;
            }
            case size - 1: {
                this.endOfFieldCase(
                    size,
                    type,
                    coordinates,
                    shipCoordinates,
                    ships,
                    true
                );
                break;
            }
            default: {
                switch (type) {
                    case ShipsTypeEnum.BATTLESHIP: {
                        if (coordinates.y === size - 2) {
                            this.endOfFieldCase(
                                size,
                                type,
                                coordinates,
                                shipCoordinates,
                                ships,
                                true
                            );
                        } else {
                            if (
                                ships.every(ship =>
                                    ship.cells.every(
                                        cell =>
                                            this.cellCheck(cell, {
                                                x: coordinates.x,
                                                y: coordinates.y - 1
                                            }) &&
                                            this.cellCheck(cell, coordinates) &&
                                            this.cellCheck(cell, {
                                                x: coordinates.x,
                                                y: coordinates.y + 1
                                            }) &&
                                            this.cellCheck(cell, {
                                                x: coordinates.x,
                                                y: coordinates.y + 2
                                            })
                                    )
                                )
                            ) {
                                shipCoordinates.push(
                                    {
                                        x: coordinates.x,
                                        y: coordinates.y - 1
                                    },
                                    {
                                        x: coordinates.x,
                                        y: coordinates.y
                                    },
                                    {
                                        x: coordinates.x,
                                        y: coordinates.y + 1
                                    },
                                    {
                                        x: coordinates.x,
                                        y: coordinates.y + 2
                                    }
                                );
                            }
                        }
                        break;
                    }
                    case ShipsTypeEnum.CRUISER: {
                        if (
                            ships.every(ship =>
                                ship.cells.every(
                                    cell =>
                                        this.cellCheck(cell, {
                                            x: coordinates.x,
                                            y: coordinates.y - 1
                                        }) &&
                                        this.cellCheck(cell, coordinates) &&
                                        this.cellCheck(cell, {
                                            x: coordinates.x,
                                            y: coordinates.y + 1
                                        })
                                )
                            )
                        ) {
                            shipCoordinates.push(
                                {
                                    x: coordinates.x,
                                    y: coordinates.y - 1
                                },
                                {
                                    x: coordinates.x,
                                    y: coordinates.y
                                },
                                {
                                    x: coordinates.x,
                                    y: coordinates.y + 1
                                }
                            );
                        }
                        break;
                    }
                    case ShipsTypeEnum.DESTROYER: {
                        if (
                            ships.every(ship =>
                                ship.cells.every(
                                    cell =>
                                        this.cellCheck(cell, coordinates) &&
                                        this.cellCheck(cell, {
                                            x: coordinates.x,
                                            y: coordinates.y + 1
                                        })
                                )
                            )
                        ) {
                            shipCoordinates.push(
                                {
                                    x: coordinates.x,
                                    y: coordinates.y
                                },
                                {
                                    x: coordinates.x,
                                    y: coordinates.y + 1
                                }
                            );
                        }
                        break;
                    }
                    case ShipsTypeEnum.BOAT: {
                        if (
                            ships.every(ship =>
                                ship.cells.every(cell =>
                                    this.cellCheck(cell, coordinates)
                                )
                            )
                        ) {
                            shipCoordinates.push({
                                x: coordinates.x,
                                y: coordinates.y
                            });
                        }
                        break;
                    }
                }
            }
        }
        if (shipCoordinates.length === this.getShipSize(type)) {
            return shipCoordinates;
        }
    }

    quickPlacement(
        ships: ShipModel[],
        type: ShipsTypeEnum,
        size: number
    ): ShipModel {
        const ship: ShipModel = {
            cells: [],
            team: TeamEnum.GREEN,
            isSelected: false
        };
        this.coordinatesGenerator(type, ships, size).forEach(cell => {
            ship.cells.push({
                x: cell.x,
                y: cell.y,
                state: ShipStateEnum.NORMAL,
                selectedToFire: false
            });
        });
        return ship;
    }

    getShipType(cells: CoordinatesModel[]): ShipsTypeEnum {
        switch (cells.length) {
            case 1: {
                return ShipsTypeEnum.BOAT;
            }
            case 2: {
                return ShipsTypeEnum.DESTROYER;
            }
            case 3: {
                return ShipsTypeEnum.CRUISER;
            }
            case 4: {
                return ShipsTypeEnum.BATTLESHIP;
            }
        }
    }

    isVertical(ship: ShipModel): boolean {
        return ship.cells.every(cell => cell.x === ship.cells[0].x);
    }

    private coordinatesGenerator(
        type: ShipsTypeEnum,
        ships: ShipModel[],
        size: number
    ): CoordinatesModel[] {
        let coordinates: CoordinatesModel[];
        while (!coordinates) {
            const isVertical: boolean = this.getRandomInt(0, 1) === 1;
            const cellCoordinates: CoordinatesModel = {
                x: this.getRandomInt(0, size - 1),
                y: this.getRandomInt(0, size - 1)
            };
            if (isVertical) {
                coordinates = this.horizontalPlacement(
                    cellCoordinates,
                    type,
                    size,
                    ships
                );
            } else {
                coordinates = this.verticalPlacement(
                    cellCoordinates,
                    size,
                    ships,
                    type
                );
            }
        }
        return coordinates;
    }

    private getShipSize(type: ShipsTypeEnum): number {
        switch (type) {
            case ShipsTypeEnum.BATTLESHIP: {
                return 4;
            }
            case ShipsTypeEnum.CRUISER: {
                return 3;
            }
            case ShipsTypeEnum.DESTROYER: {
                return 2;
            }
            case ShipsTypeEnum.BOAT: {
                return 1;
            }
        }
    }

    private cellCheck(
        cell: CoordinatesModel,
        coordinates: CoordinatesModel
    ): boolean {
        return (
            Math.abs(cell.x - coordinates.x) > 1 ||
            Math.abs(cell.y - coordinates.y) > 1
        );
    }

    private getRandomInt(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    private endOfFieldCase(
        size: number,
        type: ShipsTypeEnum,
        coordinates: CoordinatesModel,
        shipCoordinates: CoordinatesModel[],
        ships: ShipModel[],
        isVertical: boolean
    ): void {
        let coordinate = size - this.getShipSize(type);
        for (let i = 0; i < this.getShipSize(type); i++) {
            if (
                ships.every(ship =>
                    ship.cells.every(cell =>
                        this.cellCheck(
                            cell,
                            !isVertical
                                ? {
                                      x: coordinate,
                                      y: coordinates.y
                                  }
                                : {
                                      x: coordinates.x,
                                      y: coordinate
                                  }
                        )
                    )
                )
            ) {
                shipCoordinates.push(
                    !isVertical
                        ? {
                              x: coordinate,
                              y: coordinates.y
                          }
                        : {
                              x: coordinates.x,
                              y: coordinate
                          }
                );
                coordinate++;
            }
        }
    }

    private startOfFieldCase(
        type: ShipsTypeEnum,
        coordinates: CoordinatesModel,
        shipCoordinates: CoordinatesModel[],
        ships: ShipModel[],
        isVertical: boolean
    ): void {
        for (let i = 0; i < this.getShipSize(type); i++) {
            if (
                ships.every(ship =>
                    ship.cells.every(cell =>
                        this.cellCheck(
                            cell,
                            isVertical
                                ? {
                                      x: coordinates.x,
                                      y: i
                                  }
                                : {
                                      x: i,
                                      y: coordinates.y
                                  }
                        )
                    )
                )
            ) {
                shipCoordinates.push(
                    isVertical
                        ? {
                              x: coordinates.x,
                              y: i
                          }
                        : {
                              x: i,
                              y: coordinates.y
                          }
                );
            }
        }
    }
}
