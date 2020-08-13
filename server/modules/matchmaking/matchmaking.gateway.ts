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
import { GameModeEnum } from "../../../common/game-mode.enum";
import { RoomDto } from "../../../common/dto/room.dto";
import { SearchDto } from "../../../common/dto/search.dto";
import { WsAuthService } from "../auth/ws-auth.service";
import { UserDAO } from "../db/domain/user.dao";
import { SearchServiceFactory } from "./search.service.factory";
import { SearchService } from "./search.service";

@WebSocketGateway({ namespace: "game-search" })
export class MatchmakingGateway
    implements OnGatewayDisconnect, OnGatewayConnection {
    @WebSocketServer()
    private server: Server;
    private modeToParticipantsMapping = new Map<
        GameModeEnum,
        Map<string, SearchDto>
    >().set(GameModeEnum.CLASSIC, new Map<string, SearchDto>());
    constructor(
        private wsAuthService: WsAuthService,
        private searchServiceFactory: SearchServiceFactory
    ) {}

    async handleConnection(socket: Socket): Promise<void> {
        const user: UserDAO = await this.wsAuthService.getUser(socket);
        if (!user) {
            socket.disconnect();
            return;
        }
    }

    handleDisconnect(socket: Socket): void {
        this.modeToParticipantsMapping
            .get(GameModeEnum.CLASSIC)
            .delete(socket.id);
    }

    @SubscribeMessage("search")
    async handleSearch(
        @MessageBody() gameMode: GameModeEnum,
        @ConnectedSocket() socket: Socket
    ): Promise<void> {
        const user: UserDAO = await this.wsAuthService.getUser(socket);
        const data: SearchDto = {
            id: user.id,
            gameMode: gameMode
        };
        if (
            [...this.modeToParticipantsMapping.get(gameMode)].find(
                ([, v]) => v.id === user.id
            )
        ) {
            const connectionDuplicate = [
                ...this.modeToParticipantsMapping.get(gameMode)
            ].find(([, v]) => v.id === user.id)[0];
            this.server.sockets[connectionDuplicate].disconnect();
        }
        this.modeToParticipantsMapping
            .get(data.gameMode)
            .set(socket.id.toString(), data);
        const service: SearchService = this.searchServiceFactory.getService(
            data.gameMode
        );
        const room: RoomDto = await service.search(
            this.modeToParticipantsMapping.get(data.gameMode)
        );

        if (room) {
            room.players.forEach(id => {
                this.server.to(id).emit("search", room.id);
            });
            room.players.forEach(id => {
                this.server.sockets[id].disconnect();
            });
        }
    }
}
