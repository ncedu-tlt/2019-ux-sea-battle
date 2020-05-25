import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsException
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { GameModeEnum } from "../db/domain/game-mode.enum";
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
    private classicModeParticipants = new Map<string, SearchDto>();
    private modeToParticipantsMapping = new Map<
        GameModeEnum,
        Map<string, SearchDto>
    >().set(GameModeEnum.CLASSIC, this.classicModeParticipants);
    constructor(
        private wsAuthService: WsAuthService,
        private searchFactoryService: SearchServiceFactory
    ) {}

    async handleConnection(socket: Socket): Promise<void> {
        const user: UserDAO = await this.wsAuthService.getUser(socket);
        if (user) {
            this.server.emit("connection", user.id);
        } else {
            socket.disconnect();
        }
    }

    handleDisconnect(socket: Socket): void {
        this.server.emit("leave", socket.id);
        this.modeToParticipantsMapping.set(
            this.classicModeParticipants.get(socket.id).gameMode,
            new Map<string, SearchDto>(
                [...this.classicModeParticipants].filter(
                    ([key]) => key !== socket.id
                )
            )
        );
        this.classicModeParticipants.delete(socket.id);
    }

    @SubscribeMessage("search")
    async handleSearch(
        @MessageBody() req: SearchDto,
        @ConnectedSocket() socket: Socket
    ): Promise<void> {
        if (req.gameMode === GameModeEnum.CLASSIC) {
            this.classicModeParticipants.set(socket.id.toString(), req);
            this.modeToParticipantsMapping.set(
                GameModeEnum.CLASSIC,
                this.classicModeParticipants
            );
        } else {
            throw new WsException("Unknown game mode");
        }

        const searchFactory: SearchService = this.searchFactoryService.getService(
            req.gameMode
        );
        const room: RoomDto = await searchFactory.search(
            this.modeToParticipantsMapping.get(req.gameMode)
        );

        if (room) {
            room.players.forEach(id => {
                this.server.sockets[id].emit("search", room.id);
            });
            room.players.forEach(id => {
                this.server.sockets[id].disconnect();
            });
        }
    }
}
