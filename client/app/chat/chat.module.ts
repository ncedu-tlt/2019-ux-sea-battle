import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ChatService } from "./services/chat.service";
import { SocketIoModule } from "ngx-socket-io";
import { ChatSocket } from "./chat.socket";
import { ChatComponent } from "./components/chat/chat.component";
import { FormsModule } from "@angular/forms";

@NgModule({
    declarations: [ChatComponent],
    imports: [CommonModule, SocketIoModule, FormsModule],
    providers: [ChatSocket, ChatService],
    exports: [ChatComponent]
})
export class ChatModule {}
