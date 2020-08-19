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
import { PlayerDataModel } from "../game/ws/player-data.model";
import { GameStatusEnum } from "../../../common/game-status.enum";

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
        const playerData: PlayerDataModel = await this.getPlayerData(socket);
        if (!playerData.game) {
            socket.emit("game-error");
            socket.disconnect();
            return;
        } else {
            socket.join(playerData.game.id.toString());
            let playersLimit: number;
            if (playerData.game.gameMode === GameModeEnum.CLASSIC) {
                playersLimit = 2;
            }
            let gameState: PreparingForGameDto = this.gameToPlayersMapping.get(
                playerData.game.id
            );
            if (gameState) {
                gameState.players.push({ isReady: false, id: socket.id });
                this.gameToPlayersMapping.set(playerData.game.id, gameState);
            } else {
                const players: Array<WaitingForPlayerDto> = [
                    { isReady: false, id: socket.id }
                ];
                this.gameToPlayersMapping.set(playerData.game.id, {
                    limit: playersLimit,
                    players,
                    timer: 90
                });
                gameState = this.gameToPlayersMapping.get(playerData.game.id);
            }
            if (gameState.limit === gameState.players.length) {
                this.server
                    .to(playerData.game.id.toString())
                    .emit("timer", gameState.timer);
            }
        }
    }

    async handleDisconnect(socket: Socket): Promise<void> {
        const playerData: PlayerDataModel = await this.getPlayerData(socket);
        if (playerData.game) {
            socket.leave(playerData.game.id.toString());
            const gameState: PreparingForGameDto = this.gameToPlayersMapping.get(
                playerData.game.id
            );
            if (gameState) {
                const allReady =
                    gameState.players.every(player => player.isReady) &&
                    gameState.limit === gameState.players.length;
                if (!allReady) {
                    this.server.to(playerData.game.id.toString()).emit("leave");
                    await this.gameService.updateGameState({
                        id: playerData.game.id,
                        status: GameStatusEnum.FINISHED
                    });
                }
                this.gameToPlayersMapping.delete(playerData.game.id);
            }
        }
    }

    @SubscribeMessage("ready")
    async ready(@ConnectedSocket() socket: Socket): Promise<void> {
        const playerData: PlayerDataModel = await this.getPlayerData(socket);
        const gameState: PreparingForGameDto = this.gameToPlayersMapping.get(
            playerData.game.id
        );
        gameState.players.find(
            player => player.id === socket.id
        ).isReady = true;
        if (
            gameState.players.every(player => player.isReady) &&
            gameState.limit === gameState.players.length
        ) {
            this.server.to(playerData.game.id.toString()).emit("ready");
        }
        this.gameToPlayersMapping.set(playerData.game.id, gameState);
    }

    @SubscribeMessage("cancel")
    async cancel(@ConnectedSocket() socket: Socket): Promise<void> {
        const playerData: PlayerDataModel = await this.getPlayerData(socket);
        this.gameToPlayersMapping
            .get(playerData.game.id)
            .players.find(player => player.id === socket.id).isReady = false;
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
}
