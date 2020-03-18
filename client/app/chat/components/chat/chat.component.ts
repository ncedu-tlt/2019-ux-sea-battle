import { Component, OnDestroy } from "@angular/core";
import { ChatService } from "../../services/chat.service";
import { Unsubscribable } from "rxjs";
import { ChatMessageDto } from "../../../../../common/dto/chat-message.dto";

@Component({
    selector: "sb-chat",
    templateUrl: "./chat.component.html"
})
export class ChatComponent implements OnDestroy {
    entered = false;
    name: string;

    messages: string[] = [];
    message = "";

    private subscriptions: Unsubscribable[] = [];

    constructor(private chatService: ChatService) {
        this.subscriptions.push(
            chatService.onEnter().subscribe(name => this.onEnter(name)),
            chatService
                .onMessage()
                .subscribe(message => this.onMessage(message)),
            chatService.onLeave().subscribe(name => this.onLeave(name))
        );
    }

    enter(name: string): void {
        this.chatService.enter(name);
        this.entered = true;
    }

    sendMessage(): void {
        if (!this.message.trim()) {
            return;
        }

        this.chatService.sendMessage(this.message);
        this.message = "";
    }

    private onEnter(name: string): void {
        this.messages.push(`${name} has connected`);
    }

    private onMessage(message: ChatMessageDto): void {
        this.messages.push(`${message.user}: ${message.message}`);
    }

    private onLeave(name: string): void {
        this.messages.push(`${name} has left`);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
        this.chatService.disconnect();
    }
}
