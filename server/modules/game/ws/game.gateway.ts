import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { PlayerDto } from "../../../../common/dto/player.dto";
import { UserDAO } from "../../db/domain/user.dao";
import { GameDAO } from "../../db/domain/game.dao";
import { WsAuthService } from "../../auth/ws-auth.service";
import { GameService } from "../game.service";
import { GameWsDto } from "../../../../common/dto/game-ws.dto";
import { GameModeEnum } from "../../../../common/game-mode.enum";
import { GameStatusEnum } from "../../../../common/game-status.enum";
import { CoordinatesModel } from "../../../../common/models/ship/coordinates.model";
import { ShipStateEnum } from "../../../../common/models/ship/ship-state.enum";
import { PlayerFieldDto } from "../../../../common/dto/player-field.dto";
import { TurnDto } from "../../../../common/dto/turn.dto";
import { TeamEnum } from "../../../../common/models/ship/team.enum";
import { ShipModel } from "../../../../common/models/ship/ship.model";
import { PlayerDataModel } from "./player-data.model";
import { CellModel } from "../../../../common/models/cell.model";
import { ShipCellModel } from "../../../../common/models/ship/ship-cell.model";

@WebSocketGateway({ namespace: "game" })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    gameToPlayersMapping = new Map<number, GameWsDto>();

    private turnExpirationTimer = 30;

    constructor(
        private wsAuthService: WsAuthService,
        private gameService: GameService
    ) {}

    async handleConnection(socket: Socket): Promise<void> {
        const playerData: PlayerDataModel = await this.getPlayerData(socket);
        if (!playerData.game) {
            socket.emit("game-error");
            socket.disconnect();
            return;
        }
        socket.join(playerData.game.id.toString());
    }

    async handleDisconnect(socket: Socket): Promise<void> {
        const playerData: PlayerDataModel = await this.getPlayerData(socket);
        if (playerData.game) {
            socket.leave(playerData.game.id.toString());
            const gameState: GameWsDto = this.gameToPlayersMapping.get(
                playerData.game.id
            );
            if (playerData.game.status !== GameStatusEnum.FINISHED) {
                const i = gameState.queue.findIndex(
                    player => player.id === socket.id
                );
                gameState.queue.splice(i, 1);
                this.gameToPlayersMapping.set(playerData.game.id, gameState);
                this.server.to(playerData.game.id.toString()).emit("leave");
                if (gameState.queue.length < 1) {
                    this.gameToPlayersMapping.delete(playerData.game.id);
                    await this.gameService.updateGameState({
                        id: playerData.game.id,
                        status: GameStatusEnum.FINISHED
                    });
                }
            }
        }
    }

    @SubscribeMessage("start")
    async start(
        @ConnectedSocket() socket: Socket,
        @MessageBody() field: PlayerFieldDto
    ): Promise<void> {
        const playerData: PlayerDataModel = await this.getPlayerData(socket);
        const player: PlayerDto = {
            id: socket.id,
            name: playerData.user.nickname,
            ships: field.ships,
            cells: field.cells
        };
        let playersLimit: number;
        let gameState: GameWsDto = this.gameToPlayersMapping.get(
            playerData.game.id
        );
        if (playerData.game.gameMode === GameModeEnum.CLASSIC) {
            playersLimit = 2;
        }
        if (gameState) {
            gameState.queue.push(player);
        } else {
            gameState = {
                limit: playersLimit,
                queue: [player]
            };
        }
        this.gameToPlayersMapping.set(playerData.game.id, gameState);
        if (gameState.limit === gameState.queue.length) {
            this.playerTurnPreparation(playerData.game);
        }
    }

    @SubscribeMessage("turn")
    async turn(
        @ConnectedSocket() socket: Socket,
        @MessageBody() coordinates: CoordinatesModel
    ): Promise<void> {
        const playerData: PlayerDataModel = await this.getPlayerData(socket);
        const gameState: GameWsDto = this.gameToPlayersMapping.get(
            playerData.game.id
        );
        if (!gameState) {
            socket.emit("game-error");
            socket.disconnect();
            return;
        }
        const player: PlayerDto = JSON.parse(
            JSON.stringify(
                gameState.queue.find(player => player.id !== socket.id)
            )
        );
        const playerIndex: number = gameState.queue.findIndex(
            player => player.id !== socket.id
        );
        const ship: ShipModel = player.ships.find(ship =>
            ship.cells.find(cell => this.coordinatesCheck(cell, coordinates))
        );
        const shipIndex: number = player.ships.findIndex(ship =>
            ship.cells.find(cell => this.coordinatesCheck(cell, coordinates))
        );
        if (ship) {
            this.onHit(ship, shipIndex, coordinates, player, socket);
        } else {
            this.onMiss(player, coordinates, socket);
        }
        gameState.queue[playerIndex] = JSON.parse(JSON.stringify(player));
        this.gameToPlayersMapping.set(playerData.game.id, gameState);
        const opponents: PlayerDto[] = gameState.queue.filter(
            player => player.id !== socket.id
        );
        const allDestroyed: boolean = opponents.every(player =>
            player.ships.every(ship =>
                ship.cells.every(cell => cell.state === ShipStateEnum.DESTROYED)
            )
        );
        if (allDestroyed) {
            this.server.to(gameState.queue[0].id).emit("win", {
                timer: this.turnExpirationTimer,
                name: gameState.queue[0].name,
                ships: gameState.queue[0].ships,
                cells: gameState.queue[0].cells,
                isWaiting: false
            } as TurnDto);
            this.server.to(player.id).emit("lose", {
                timer: this.turnExpirationTimer,
                name: player.name,
                ships: player.ships,
                cells: player.cells,
                isWaiting: false
            } as TurnDto);
            await this.gameService.updateGameState({
                id: playerData.game.id,
                status: GameStatusEnum.FINISHED
            });
            this.gameToPlayersMapping.delete(playerData.game.id);
        }
    }

    @SubscribeMessage("skip")
    async skip(@ConnectedSocket() socket: Socket): Promise<void> {
        const playerData: PlayerDataModel = await this.getPlayerData(socket);
        const currentPlayer: PlayerDto = this.gameToPlayersMapping
            .get(playerData.game.id)
            .queue.shift();
        this.gameToPlayersMapping
            .get(playerData.game.id)
            .queue.push(currentPlayer);
        this.playerTurnPreparation(playerData.game);
    }

    private playerTurnPreparation(game: GameDAO): void {
        const gameState: GameWsDto = this.gameToPlayersMapping.get(game.id);

        const waitingPlayer: PlayerDto = JSON.parse(
            JSON.stringify(gameState.queue[1])
        );
        waitingPlayer.ships.forEach(ship => {
            ship.team = TeamEnum.GREEN;
            ship.cells.forEach(cell => {
                if (cell.state === ShipStateEnum.HIDDEN) {
                    cell.state = ShipStateEnum.NORMAL;
                }
            });
        });

        const opponent: PlayerDto = JSON.parse(
            JSON.stringify(gameState.queue[1])
        );
        opponent.ships.forEach(ship => {
            ship.team = TeamEnum.RED;
            ship.cells.forEach(cell => {
                if (cell.state === ShipStateEnum.NORMAL) {
                    cell.state = ShipStateEnum.HIDDEN;
                }
            });
        });

        this.server.to(gameState.queue[0].id).emit("turn", {
            timer: this.turnExpirationTimer,
            name: opponent.name,
            ships: opponent.ships,
            cells: opponent.cells,
            isWaiting: true
        } as TurnDto);

        this.server.to(waitingPlayer.id).emit("waiting", {
            timer: this.turnExpirationTimer,
            name: waitingPlayer.name,
            ships: waitingPlayer.ships,
            cells: waitingPlayer.cells,
            isWaiting: false
        } as TurnDto);
        this.gameToPlayersMapping.set(game.id, gameState);
    }

    private async getPlayerData(socket: Socket): Promise<PlayerDataModel> {
        const user: UserDAO = await this.wsAuthService.getUser(socket);
        if (!user) {
            socket.disconnect();
            return;
        }
        const game: GameDAO = await this.gameService.getGameByUserId(user.id);
        return { user, game };
    }

    private coordinatesCheck(
        cell: CellModel | ShipCellModel,
        coordinates: CoordinatesModel
    ): boolean {
        return cell.x === coordinates.x && cell.y === coordinates.y;
    }

    private onHit(
        ship: ShipModel,
        shipIndex: number,
        coordinates: CoordinatesModel,
        player: PlayerDto,
        socket: Socket
    ): void {
        ship.cells.find(cell =>
            this.coordinatesCheck(cell, coordinates)
        ).state = ShipStateEnum.HIT;
        if (ship.cells.every(cell => cell.state === ShipStateEnum.HIT)) {
            ship.cells.forEach(cell => (cell.state = ShipStateEnum.DESTROYED));
        }
        const waitingPlayer: PlayerDto = JSON.parse(JSON.stringify(player));
        player.ships[shipIndex] = ship;
        player.ships.forEach(ship => {
            ship.team = TeamEnum.RED;
            ship.cells.forEach(cell => {
                if (cell.state === ShipStateEnum.NORMAL) {
                    cell.state = ShipStateEnum.HIDDEN;
                }
            });
        });
        socket.emit("hit", {
            timer: this.turnExpirationTimer,
            name: player.name,
            ships: player.ships,
            cells: player.cells,
            isWaiting: true
        } as TurnDto);
        waitingPlayer.ships.forEach(ship => {
            ship.team = TeamEnum.GREEN;
            ship.cells.forEach(cell => {
                if (cell.state === ShipStateEnum.HIDDEN) {
                    cell.state = ShipStateEnum.NORMAL;
                }
            });
        });
        this.server.to(waitingPlayer.id).emit("waiting", {
            timer: this.turnExpirationTimer,
            name: waitingPlayer.name,
            ships: waitingPlayer.ships,
            cells: waitingPlayer.cells,
            isWaiting: false
        } as TurnDto);
    }

    private onMiss(
        player: PlayerDto,
        coordinates: CoordinatesModel,
        socket: Socket
    ): void {
        player.cells.find(cell =>
            this.coordinatesCheck(cell, coordinates)
        ).hit = true;
        player.ships.forEach(ship => {
            ship.team = TeamEnum.RED;
            ship.cells.forEach(cell => {
                if (cell.state === ShipStateEnum.NORMAL) {
                    cell.state = ShipStateEnum.HIDDEN;
                }
            });
        });
        socket.emit("miss", {
            timer: 5,
            name: player.name,
            ships: player.ships,
            cells: player.cells,
            isWaiting: true
        } as TurnDto);
    }
}
