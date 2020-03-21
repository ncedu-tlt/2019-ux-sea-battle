import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";

import { AuthService } from "../auth.service";
import { Payload } from "../../../../common/interfaces/payload.interface";

const SECRET_KEY = process.env.SECRET_KEY || "secret";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: SECRET_KEY
        });
    }

    async validate(payload: Payload, done: VerifiedCallback): Promise<any> {
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
