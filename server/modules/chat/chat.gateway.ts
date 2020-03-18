import {
    ConnectedSocket,
    MessageBody,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChatMessageDto } from "../../../common/dto/chat-message.dto";

@WebSocketGateway({ namespace: "chat" })
export class ChatGateway implements OnGatewayDisconnect {
    @WebSocketServer()
    private server: Server;

    private socketToUserMapping: { [key: string]: string } = {};

    handleDisconnect(socket: Socket): void {
        this.server.emit("leave", this.socketToUserMapping[socket.id]);
        delete this.socketToUserMapping[socket.id];
    }

    @SubscribeMessage("enter")
    handleEnter(
        @MessageBody() username: string,
        @ConnectedSocket() socket: Socket
    ): void {
        this.socketToUserMapping[socket.id] = username;
        this.server.emit("enter", username);
    }

    @SubscribeMessage("message")
    handleMessage(
        @MessageBody() message: string,
        @ConnectedSocket() socket: Socket
    ): void {
        this.server.emit("message", {
            user: this.socketToUserMapping[socket.id],
            message
        } as ChatMessageDto);
    }
}
