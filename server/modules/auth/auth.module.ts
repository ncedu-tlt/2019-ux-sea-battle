import { Module } from "@nestjs/common";
import { CryptographerService } from "./cryptographer.service";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { DbModule } from "../db/db.module";
import { JwtModule } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { JwtStrategy } from "./passport/jwt.strategy";
import { PassportModule } from "@nestjs/passport";

const SECRET_KEY = process.env.SECRET_KEY || "secret";

@Module({
    imports: [
        DbModule,
        PassportModule,
        JwtModule.register({
            secret: SECRET_KEY
        })
    ],
    providers: [CryptographerService, UsersService, AuthService, JwtStrategy],
    controllers: [AuthController]
})
export class AuthModule {}
