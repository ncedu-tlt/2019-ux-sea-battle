import { Injectable } from "@nestjs/common";
import { AuthService } from "../../auth/auth.service";
import { ConfigService } from "@nestjs/config";
import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";
import { TokenPayloadModel } from "../../../../common/models/token-payload.model";
import { PassportStrategy } from "@nestjs/passport";
import { WsException } from "@nestjs/websockets";

@Injectable()
export class JwtWsStrategy extends PassportStrategy(
    Strategy,
    "websocketStrategy"
) {
    constructor(
        private authService: AuthService,
        private configService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromUrlQueryParameter("tokenSecretKey"),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>("tokenSecretKey")
        });
    }

    async validate(
        payload: TokenPayloadModel,
        done: VerifiedCallback
    ): Promise<any> {
        const user = await this.authService.validate(payload);
        if (!user) {
            return done(new WsException("Unauthorized access"), false);
        }

        return done(null, user, payload.iat);
    }
}
