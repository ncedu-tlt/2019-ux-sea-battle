import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { UserDTO } from "../../../common/dto/user.dto";
import { Socket } from "socket.io";
import * as jwt from "jsonwebtoken";
import { TokenPayloadModel } from "../../../common/models/token-payload.model";

@Injectable()
export class WsExceptionHandlingService {
    constructor(private usersService: UsersService) {}

    async tokenCheck(socket: Socket): Promise<UserDTO> {
        try {
            const payload: TokenPayloadModel = jwt.verify(
                socket.handshake.query.tokenSecretKey,
                "tokenSecretKey"
            ) as TokenPayloadModel;
            return await this.usersService.findById(payload.sub);
        } catch (e) {
            return undefined;
        }
    }
}
