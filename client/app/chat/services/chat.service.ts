import { Injectable } from "@angular/core";
import { ChatSocket } from "../chat.socket";
import { Observable } from "rxjs";
import { ChatMessageDto } from "../../../../common/dto/chat-message.dto";

@Injectable()
export class ChatService {
    constructor(private socket: ChatSocket) {}

    connect(): void {
        this.socket.connect();
    }

    disconnect(): void {
        this.socket.disconnect();
    }

    enter(name: string): void {
        this.socket.emit("enter", name);
    }

    sendMessage(message: string): void {
        this.socket.emit("message", message);
    }

    onEnter(): Observable<string> {
        return this.socket.fromEvent<string>("enter");
    }

    onMessage(): Observable<ChatMessageDto> {
        return this.socket.fromEvent<ChatMessageDto>("message");
    }

    onLeave(): Observable<string> {
        return this.socket.fromEvent<string>("leave");
    }
}
