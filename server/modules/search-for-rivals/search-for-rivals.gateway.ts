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
import { GameModeEnum } from "../db/domain/game-mode.enum";
import { ClassicService } from "./classic.service";
import { RoomDto } from "../../../common/dto/room.dto";
import { SearchDto } from "../../../common/dto/search.dto";
import { UseGuards } from "@nestjs/common";
import { WsAuthGuard } from "../../guards/ws-auth.guard";
import { UsersService } from "../users/users.service";
import { UserDTO } from "../../../common/dto/user.dto";
import { WsExceptionHandlingService } from "./ws-exception-handling.service";

@UseGuards(WsAuthGuard)
@WebSocketGateway({ namespace: "rivals" })
export class SearchForRivalsGateway
    implements OnGatewayDisconnect, OnGatewayConnection {
    @WebSocketServer()
    private server: Server;
    private socketToRivalsMapping = new Map<string, string>();
    private room: RoomDto;

    constructor(
        private classicService: ClassicService,
        private usersService: UsersService,
        private wsExceptionHandlingService: WsExceptionHandlingService
    ) {}

    async handleConnection(socket: Socket): Promise<void> {
        const user: UserDTO = await this.wsExceptionHandlingService.tokenCheck(
            socket
        );
        if (!user) {
            socket.emit("connection", "401");
            socket.disconnect();
        } else {
            this.server.emit("connection", user.id);
        }
    }

    handleDisconnect(socket: Socket): void {
        this.server.emit("leave", socket.id);
        this.socketToRivalsMapping.delete(socket.id);
    }

    @SubscribeMessage("search")
    async handleSearch(
        @MessageBody() req: SearchDto,
        @ConnectedSocket() socket: Socket
    ): Promise<void> {
        this.socketToRivalsMapping.set(socket.id.toString(), req.gameMode);
        switch (req.gameMode) {
            case GameModeEnum.CLASSIC:
                this.room = await this.classicService.classicModeSearch(
                    this.socketToRivalsMapping,
                    req.gameMode
                );
                break;
            case GameModeEnum.CLASSIC_P:
                // 2
                break;
            case GameModeEnum.SALVO:
                // 3
                break;
            case GameModeEnum.SALVO_P:
                // 4
                break;
        }
        if (this.room) {
            this.room.players.forEach(id => {
                this.server.sockets[id].join(this.room.id);
            });
            this.server.to(this.room.id).emit("search", this.room.id);
            this.room.players.forEach(id => {
                this.server.sockets[id].disconnect();
            });
        }
    }
}
