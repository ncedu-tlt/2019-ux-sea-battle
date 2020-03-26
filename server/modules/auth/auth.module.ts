import { Module } from "@nestjs/common";
import { CryptographerService } from "./cryptographer.service";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { DbModule } from "../db/db.module";
import { JwtModule } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { JwtStrategy } from "./passport/jwt.strategy";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
    imports: [
        ConfigModule,
        DbModule,
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>("tokenSecretKey")
            }),
            inject: [ConfigService]
        })
    ],
    providers: [CryptographerService, UsersService, AuthService, JwtStrategy],
    controllers: [AuthController]
})
export class AuthModule {}
