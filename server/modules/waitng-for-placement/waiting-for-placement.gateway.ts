import {
    ConnectedSocket,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from "@nestjs/websockets";
import { WsAuthService } from "../auth/ws-auth.service";
import { Server, Socket } from "socket.io";
import { UserDAO } from "../db/domain/user.dao";
import { GameService } from "../game/game.service";
import { GameDAO } from "../db/domain/game.dao";
import { PreparingForGameDto } from "../../../common/dto/preparing-for-game.dto";
import { WaitingForPlayerDto } from "../../../common/dto/waiting-for-player.dto";
import { GameModeEnum } from "../../../common/game-mode.enum";

@WebSocketGateway({ namespace: "placement" })
export class WaitingForPlacementGateway
    implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    gameToPlayersMapping = new Map<number, PreparingForGameDto>();

    constructor(
        private wsAuthService: WsAuthService,
        private gameService: GameService
    ) {}

    async handleConnection(socket: Socket): Promise<void> {
        const user: UserDAO = await this.wsAuthService.getUser(socket);
        if (!user) {
            socket.disconnect();
        }
        const game: GameDAO = await this.gameService.getGameByUserId(user.id);
        let playersLimit: number;
        if (game.gameMode === GameModeEnum.CLASSIC) {
            playersLimit = 2;
        }
        if (this.gameToPlayersMapping.get(game.id)) {
            this.gameToPlayersMapping
                .get(game.id)
                .players.push({ isReady: false, id: socket.id });
        } else {
            const players: Array<WaitingForPlayerDto> = [
                { isReady: false, id: socket.id }
            ];
            this.gameToPlayersMapping.set(game.id, {
                limit: playersLimit,
                players,
                timer: 90
            });
        }
    }

    async handleDisconnect(socket: Socket): Promise<void> {
        const user: UserDAO = await this.wsAuthService.getUser(socket);
        const game: GameDAO = await this.gameService.getGameByUserId(user.id);
        if (this.gameToPlayersMapping.get(game.id) && game) {
            this.gameToPlayersMapping
                .get(game.id)
                .players.forEach(player =>
                    this.server.to(player.id).emit("leave")
                );
            this.gameToPlayersMapping.delete(game.id);
        }
    }

    @SubscribeMessage("timer")
    async getTimer(@ConnectedSocket() socket: Socket): Promise<void> {
        const user: UserDAO = await this.wsAuthService.getUser(socket);
        const game: GameDAO = await this.gameService.getGameByUserId(user.id);
        if (
            this.gameToPlayersMapping.get(game.id).limit ===
            this.gameToPlayersMapping.get(game.id).players.length
        ) {
            this.gameToPlayersMapping.get(game.id).players.forEach(player => {
                const playerSocket: Socket = this.server.sockets[player.id];
                playerSocket.join(game.id.toString());
            });
            this.server
                .to(game.id.toString())
                .emit("timer", this.gameToPlayersMapping.get(game.id).timer);
        }
    }

    @SubscribeMessage("ready")
    async ready(@ConnectedSocket() socket: Socket): Promise<void> {
        const user: UserDAO = await this.wsAuthService.getUser(socket);
        const game: GameDAO = await this.gameService.getGameByUserId(user.id);
        this.gameToPlayersMapping
            .get(game.id)
            .players.find(player => player.id === socket.id).isReady = true;
        if (
            this.gameToPlayersMapping
                .get(game.id)
                .players.every(player => player.isReady) &&
            this.gameToPlayersMapping.get(game.id).limit ===
                this.gameToPlayersMapping.get(game.id).players.length
        ) {
            this.gameToPlayersMapping
                .get(game.id)
                .players.forEach(player =>
                    this.server.to(player.id).emit("ready")
                );
        }
    }

    @SubscribeMessage("cancel")
    async cancel(@ConnectedSocket() socket: Socket): Promise<void> {
        const user: UserDAO = await this.wsAuthService.getUser(socket);
        const game: GameDAO = await this.gameService.getGameByUserId(user.id);
        this.gameToPlayersMapping
            .get(game.id)
            .players.find(player => player.id === socket.id).isReady = false;
    }
}
