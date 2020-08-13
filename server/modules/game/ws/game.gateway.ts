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
import { PlayerDataModel } from "../../../../common/models/game/player-data.model";
import { CellModel } from "../../../../common/models/cell.model";
import { ShipCellModel } from "../../../../common/models/ship/ship-cell.model";

@WebSocketGateway({ namespace: "game" })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    gameToPlayersMapping = new Map<number, GameWsDto>();

    private turnExpirationTimer = 45;

    constructor(
        private wsAuthService: WsAuthService,
        private gameService: GameService
    ) {}

    async handleConnection(socket: Socket): Promise<void> {
        const playerData: PlayerDataModel = await this.getPlayerData(socket);
        if (!playerData.user) {
            socket.disconnect();
        }
        if (!playerData.game) {
            socket.emit("game-error");
            socket.disconnect();
        }
        socket.join(playerData.game.id.toString());
    }

    async handleDisconnect(socket: Socket): Promise<void> {
        const playerData: PlayerDataModel = await this.getPlayerData(socket);
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

    @SubscribeMessage("start")
    async start(
        @ConnectedSocket() socket: Socket,
        @MessageBody() field: PlayerFieldDto
    ): Promise<void> {
        const playerData: PlayerDataModel = await this.getPlayerData(socket);
        const player: PlayerDto = {
            id: socket.id,
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
        const player: PlayerDto = gameState.queue.find(
            player => player.id !== socket.id
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
        gameState.queue[playerIndex] = player;
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
            this.server
                .to(playerData.game.id.toString())
                .emit("winner", playerData.user.nickname);
            await this.gameService.updateGameState({
                id: playerData.game.id,
                status: GameStatusEnum.FINISHED
            });
        } else {
            const currentPlayer: PlayerDto = gameState.queue.shift();
            gameState.queue.push(currentPlayer);
            this.gameToPlayersMapping.set(playerData.game.id, gameState);
            this.playerTurnPreparation(playerData.game);
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
        const opponent: PlayerDto = gameState.queue.find(
            player => player.id !== gameState.queue[0].id
        );
        opponent.ships.forEach(ship => {
            ship.team = TeamEnum.RED;
            ship.cells.find(cell => cell.state === ShipStateEnum.NORMAL).state =
                ShipStateEnum.HIDDEN;
        });
        gameState.queue.forEach(player => {
            if (player.id !== gameState.queue[0].id) {
                const waitingPlayer: PlayerDto = player;
                waitingPlayer.ships.forEach(ship => {
                    ship.team = TeamEnum.GREEN;
                    ship.cells.find(
                        cell => cell.state === ShipStateEnum.HIDDEN
                    ).state = ShipStateEnum.NORMAL;
                });
                this.server.to(player.id).emit("waiting", {
                    timer: this.turnExpirationTimer,
                    ships: waitingPlayer.ships,
                    cells: waitingPlayer.cells
                } as TurnDto);
            }
        });
        this.server.to(gameState.queue[0].id).emit("turn", {
            timer: this.turnExpirationTimer,
            ships: opponent.ships,
            cells: opponent.cells
        } as TurnDto);
        this.gameToPlayersMapping.set(game.id, gameState);
    }

    private async getPlayerData(socket: Socket): Promise<PlayerDataModel> {
        const user: UserDAO = await this.wsAuthService.getUser(socket);
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
        player.ships[shipIndex] = ship;
        socket.emit("hit", player.ships);
    }

    private onMiss(
        player: PlayerDto,
        coordinates: CoordinatesModel,
        socket: Socket
    ): void {
        player.cells.find(cell =>
            this.coordinatesCheck(cell, coordinates)
        ).hit = true;
        socket.emit("miss", player.cells);
    }
}
