import { Module } from "@nestjs/common";
import { UsersController } from "server/modules/users/users.controller";
import { DbModule } from "../db/db.module";

@Module({
    imports: [DbModule],
    controllers: [UsersController]
})
export class UsersModule {}
