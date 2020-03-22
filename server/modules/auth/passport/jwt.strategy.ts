import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";

import { AuthService } from "../auth.service";
import { PayloadModel } from "../../../../common/models/payload.model";

const TOKEN_SECRET_KEY = process.env.TOKEN_SECRET_KEY || "secret";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: TOKEN_SECRET_KEY
        });
    }

    async validate(payload: PayloadModel, done: VerifiedCallback): Promise<any> {
        const user = await this.authService.validate(payload);
        if (!user) {
            return done(
                new HttpException(
                    "Unauthorized access",
                    HttpStatus.UNAUTHORIZED
                ),
                false
            );
        }

        return done(null, user, payload.iat);
    }
}
