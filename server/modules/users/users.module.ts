import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { DbModule } from "../db/db.module";
import { UsersController } from "./users.controller";
import { CryptographerService } from "../auth/cryptographer.service";
import { PassportModule } from "@nestjs/passport";

@Module({
    imports: [DbModule, PassportModule.register({ defaultStrategy: "jwt" })],
    providers: [UsersService, CryptographerService],
    controllers: [UsersController]
})
export class UsersModule {}
