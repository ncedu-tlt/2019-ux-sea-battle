import { Module } from "@nestjs/common";
import { CryptographerService } from "./cryptographer.service";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { DbModule } from "../db/db.module";
import { JwtModule } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";

@Module({
    imports: [
        DbModule,
        JwtModule.register({
            secret: process.env.SECRET_KEY || "secret"
        })
    ],
    providers: [CryptographerService, UsersService, AuthService],
    controllers: [AuthController]
})
export class AuthModule {}
