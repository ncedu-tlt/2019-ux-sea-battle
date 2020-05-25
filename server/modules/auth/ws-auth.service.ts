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

    async getUser(socket: Socket): Promise<UserDAO> | undefined {
        try {
            const payload: TokenPayloadModel = jwt.verify(
                socket.handshake.query.authorizationToken,
                this.configService.get<string>("tokenSecretKey")
            ) as TokenPayloadModel;
            this.logger.debug(`Payload: ${payload}`);
            return await this.usersService.findById(payload.sub);
        } catch (e) {
            this.logger.debug(`Token is empty: ${e.message}. ID: ${socket.id}`);
            socket.emit("leave", "401");
            socket.disconnect();
        }
    }
}
