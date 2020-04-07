import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { DbModule } from "../db/db.module";
import { UsersController } from "./users.controller";
import { CryptographerService } from "../auth/cryptographer.service";

@Module({
    imports: [DbModule],
    providers: [UsersService, CryptographerService],
    controllers: [UsersController]
})
export class UsersModule {}
