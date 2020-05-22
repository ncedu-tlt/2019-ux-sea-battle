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
import { SearchFactoryService } from "./search-factory.service";
import { Search } from "./search";

@WebSocketGateway({ namespace: "game-search" })
export class SearchForRivalsGateway
    implements OnGatewayDisconnect, OnGatewayConnection {
    @WebSocketServer()
    private server: Server;
    private idToClassicModeMapping = new Map<string, SearchDto>();
    constructor(
        private wsAuthService: WsAuthService,
        private searchFactoryService: SearchFactoryService
    ) {}

    async handleConnection(socket: Socket): Promise<void> {
        const user: UserDAO = await this.wsAuthService.tokenCheck(socket);
        if (!user) {
            this.wsAuthService.disconnect(socket);
        } else {
            this.server.emit("connection", user.id);
        }
    }

    handleDisconnect(socket: Socket): void {
        this.server.emit("leave", socket.id);
        this.idToClassicModeMapping.delete(socket.id);
    }

    @SubscribeMessage("search")
    async handleSearch(
        @MessageBody() req: SearchDto,
        @ConnectedSocket() socket: Socket
    ): Promise<void> {
        if (req.gameMode === GameModeEnum.CLASSIC) {
            this.idToClassicModeMapping.set(socket.id.toString(), req);
        } else {
            throw new WsException("Unknown game mode");
        }

        const searchFactory: Search = this.searchFactoryService.searchForRivals(
            req.gameMode
        );
        const room: RoomDto = await searchFactory.search(
            this.idToClassicModeMapping
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
