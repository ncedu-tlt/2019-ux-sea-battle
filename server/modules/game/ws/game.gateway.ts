import {
    ConnectedSocket,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { PlayerDto } from "../../../../common/dto/player.dto";
import { ShipModel } from "../../../../common/models/ship/ship.model";
import { UserDAO } from "../../db/domain/user.dao";
import { GameDAO } from "../../db/domain/game.dao";
import { WsAuthService } from "../../auth/ws-auth.service";
import { GameService } from "../game.service";
import { GameWsDto } from "../../../../common/dto/game-ws.dto";
import { GameModeEnum } from "../../../../common/game-mode.enum";
import { GameStatusEnum } from "../../../../common/game-status.enum";
import { Logger } from "@nestjs/common";

@WebSocketGateway({ namespace: "game" })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    gameToPlayersMapping = new Map<number, GameWsDto>();

    constructor(
        private wsAuthService: WsAuthService,
        private gameService: GameService
    ) {}

    async handleConnection(socket: Socket): Promise<void> {
        Logger.debug("game.gateway - CONNECTION\n");
        const user: UserDAO = await this.wsAuthService.getUser(socket);
        const game: GameDAO = await this.gameService.getGameByUserId(user.id);
        if (!user) {
            socket.disconnect();
        }
        socket.join(game.id.toString());
    }

    async handleDisconnect(socket: Socket): Promise<void> {
        Logger.debug("game.gateway - DISCONNECT\n");
        const user: UserDAO = await this.wsAuthService.getUser(socket);
        const game: GameDAO = await this.gameService.getGameByUserId(user.id);
        const i = this.gameToPlayersMapping
            .get(game.id)
            .players.findIndex(player => player.id === socket.id);
        this.gameToPlayersMapping.get(game.id).players.splice(i, 1);
        socket.leave(game.id.toString());
        if (this.gameToPlayersMapping.get(game.id).players.length < 1) {
            this.gameToPlayersMapping.delete(game.id);
            await this.gameService.updateGameState({
                id: game.id,
                status: GameStatusEnum.FINISHED
            });
        }
    }

    @SubscribeMessage("get-ships")
    async getShips(@ConnectedSocket() socket: Socket): Promise<void> {
        const user: UserDAO = await this.wsAuthService.getUser(socket);
        const game: GameDAO = await this.gameService.getGameByUserId(user.id);
        if (
            this.gameToPlayersMapping
                .get(game.id)
                .players.find(player => player.id === socket.id).ships
        ) {
            socket.emit(
                "getting-ships",
                this.gameToPlayersMapping
                    .get(game.id)
                    .players.find(player => player.id === socket.id).ships
            );
        }
    }

    @SubscribeMessage("start")
    async start(
        @ConnectedSocket() socket: Socket,
        ships: ShipModel[]
    ): Promise<void> {
        Logger.debug("game.gateway - START\n");
        const user: UserDAO = await this.wsAuthService.getUser(socket);
        const game: GameDAO = await this.gameService.getGameByUserId(user.id);
        const player: PlayerDto = {
            id: socket.id,
            ships
        };
        let playersLimit: number;
        if (game.gameMode === GameModeEnum.CLASSIC) {
            playersLimit = 2;
        }
        if (this.gameToPlayersMapping.get(game.id)) {
            this.gameToPlayersMapping.get(game.id).players.push(player);
        } else {
            this.gameToPlayersMapping.set(game.id, {
                limit: playersLimit,
                players: [player]
            });
        }
        if (
            this.gameToPlayersMapping.get(game.id).limit ===
            this.gameToPlayersMapping.get(game.id).players.length
        ) {
            this.server.to(game.id.toString()).emit("start");
        }
    }
}
