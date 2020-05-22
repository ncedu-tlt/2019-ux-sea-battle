import { Injectable, Logger } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { Socket } from "socket.io";
import * as jwt from "jsonwebtoken";
import { TokenPayloadModel } from "../../../common/models/token-payload.model";
import { ConfigService } from "@nestjs/config";
import { UserDAO } from "../db/domain/user.dao";

@Injectable()
export class WsAuthService {
    constructor(
        private usersService: UsersService,
        private configService: ConfigService
    ) {}

    async tokenCheck(socket: Socket): Promise<UserDAO> | undefined {
        try {
            const payload: TokenPayloadModel = jwt.verify(
                socket.handshake.query.tokenSecretKey,
                this.configService.get<string>("tokenSecretKey")
            ) as TokenPayloadModel;
            Logger.debug(
                `Token: ${socket.handshake.query.tokenSecretKey}. Payload: ${payload}`
            );
            return await this.usersService.findById(payload.sub);
        } catch (e) {
            Logger.debug(`Token is empty: ${e.message}. ID: ${socket.id}`);
            return undefined;
        }
    }

    disconnect(socket: Socket): void {
        socket.emit("connection", "401");
        socket.disconnect();
    }
}
