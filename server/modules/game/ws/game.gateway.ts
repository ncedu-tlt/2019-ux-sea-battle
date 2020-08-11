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
        const user: UserDAO = await this.wsAuthService.getUser(socket);
        const game: GameDAO = await this.gameService.getGameByUserId(user.id);
        if (!user) {
            socket.disconnect();
        }
        if (!game) {
            socket.emit("game-error");
            socket.disconnect();
        }
        socket.join(game.id.toString());
    }

    async handleDisconnect(socket: Socket): Promise<void> {
        const user: UserDAO = await this.wsAuthService.getUser(socket);
        const game: GameDAO = await this.gameService.getGameByUserId(user.id);
        socket.leave(game.id.toString());
        if (game.status !== GameStatusEnum.FINISHED) {
            const i = this.gameToPlayersMapping
                .get(game.id)
                .queue.findIndex(player => player.id === socket.id);
            this.gameToPlayersMapping.get(game.id).queue.splice(i, 1);
            this.server.to(game.id.toString()).emit("leave");
            if (this.gameToPlayersMapping.get(game.id).queue.length < 1) {
                this.gameToPlayersMapping.delete(game.id);
                await this.gameService.updateGameState({
                    id: game.id,
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
        const user: UserDAO = await this.wsAuthService.getUser(socket);
        const game: GameDAO = await this.gameService.getGameByUserId(user.id);
        const player: PlayerDto = {
            id: socket.id,
            ships: field.ships,
            cells: field.cells
        };
        let playersLimit: number;
        if (game.gameMode === GameModeEnum.CLASSIC) {
            playersLimit = 2;
        }
        if (this.gameToPlayersMapping.get(game.id)) {
            this.gameToPlayersMapping.get(game.id).queue.push(player);
        } else {
            this.gameToPlayersMapping.set(game.id, {
                limit: playersLimit,
                queue: [player]
            });
        }
        if (
            this.gameToPlayersMapping.get(game.id).limit ===
            this.gameToPlayersMapping.get(game.id).queue.length
        ) {
            this.playerTurnPreparation(game);
        }
    }

    @SubscribeMessage("turn")
    async turn(
        @ConnectedSocket() socket: Socket,
        @MessageBody() coordinates: CoordinatesModel
    ): Promise<void> {
        const user: UserDAO = await this.wsAuthService.getUser(socket);
        const game: GameDAO = await this.gameService.getGameByUserId(user.id);
        if (!this.gameToPlayersMapping.get(game.id)) {
            socket.emit("game-error");
            socket.disconnect();
        }
        const player: PlayerDto = this.gameToPlayersMapping
            .get(game.id)
            .queue.find(player => player.id !== socket.id);
        const playerIndex: number = this.gameToPlayersMapping
            .get(game.id)
            .queue.findIndex(player => player.id !== socket.id);
        const ship: ShipModel = player.ships.find(ship =>
            ship.cells.find(
                cell => cell.x === coordinates.x && cell.y === coordinates.y
            )
        );
        const shipIndex: number = player.ships.findIndex(ship =>
            ship.cells.find(
                cell => cell.x === coordinates.x && cell.y === coordinates.y
            )
        );

        if (ship) {
            ship.cells.find(
                cell => cell.x === coordinates.x && cell.y === coordinates.y
            ).state = ShipStateEnum.HIT;
            if (ship.cells.every(cell => cell.state === ShipStateEnum.HIT)) {
                ship.cells.forEach(
                    cell => (cell.state = ShipStateEnum.DESTROYED)
                );
            }
            player.ships[shipIndex] = ship;
            socket.emit("hit", player.ships);
        } else {
            player.cells.find(
                cell => cell.x === coordinates.x && cell.y === coordinates.y
            ).hit = true;
            socket.emit("miss", player.cells);
        }
        this.gameToPlayersMapping.get(game.id).queue[playerIndex] = player;

        const opponents: PlayerDto[] = this.gameToPlayersMapping
            .get(game.id)
            .queue.filter(player => player.id !== socket.id);
        const allDestroyed: boolean = opponents.every(player =>
            player.ships.every(ship =>
                ship.cells.every(cell => cell.state === ShipStateEnum.DESTROYED)
            )
        );
        if (allDestroyed) {
            this.server.to(game.id.toString()).emit("winner", user.nickname);
            await this.gameService.updateGameState({
                id: game.id,
                status: GameStatusEnum.FINISHED
            });
        } else {
            const currentPlayer: PlayerDto = this.gameToPlayersMapping
                .get(game.id)
                .queue.shift();
            this.gameToPlayersMapping.get(game.id).queue.push(currentPlayer);
            this.playerTurnPreparation(game);
        }
    }

    @SubscribeMessage("skip")
    async skip(@ConnectedSocket() socket: Socket): Promise<void> {
        const user: UserDAO = await this.wsAuthService.getUser(socket);
        const game: GameDAO = await this.gameService.getGameByUserId(user.id);
        const currentPlayer: PlayerDto = this.gameToPlayersMapping
            .get(game.id)
            .queue.shift();
        this.gameToPlayersMapping.get(game.id).queue.push(currentPlayer);
        this.playerTurnPreparation(game);
    }

    private playerTurnPreparation(game: GameDAO): void {
        const opponent: PlayerDto = this.gameToPlayersMapping
            .get(game.id)
            .queue.find(
                player =>
                    player.id !==
                    this.gameToPlayersMapping.get(game.id).queue[0].id
            );
        opponent.ships.forEach(ship => {
            ship.team = TeamEnum.RED;
            ship.cells.find(cell => cell.state === ShipStateEnum.NORMAL).state =
                ShipStateEnum.HIDDEN;
        });
        this.gameToPlayersMapping.get(game.id).queue.forEach(player => {
            if (
                player.id !== this.gameToPlayersMapping.get(game.id).queue[0].id
            ) {
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
        this.server
            .to(this.gameToPlayersMapping.get(game.id).queue[0].id)
            .emit("turn", {
                timer: this.turnExpirationTimer,
                ships: opponent.ships,
                cells: opponent.cells
            } as TurnDto);
    }
}
