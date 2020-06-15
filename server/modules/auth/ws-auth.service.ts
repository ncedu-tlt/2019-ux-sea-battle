import { Injectable, Logger } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { Socket } from "socket.io";
import * as jwt from "jsonwebtoken";
import { TokenPayloadModel } from "../../../common/models/token-payload.model";
import { ConfigService } from "@nestjs/config";
import { UserDAO } from "../db/domain/user.dao";

@Injectable()
export class WsAuthService {
    private readonly logger = new Logger(WsAuthService.name);
    constructor(
        private usersService: UsersService,
        private configService: ConfigService
    ) {}

    async getUser(socket: Socket): Promise<UserDAO | undefined> {
        const token = socket.handshake.query.token;
        try {
            const payload: TokenPayloadModel = jwt.verify(
                token,
                this.configService.get<string>("tokenSecretKey")
            ) as TokenPayloadModel;
            return await this.usersService.findById(payload.sub);
        } catch (e) {
            this.logger.debug(`Token: ${e.message}. ID: ${socket.id}`);
            socket.emit("tokenExpired", "401");
            socket.disconnect();
        }
    }
}
