import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { DbModule } from "../db/db.module";
import { UsersManagementController } from "./users-management.controller";
import { UsersController } from "./users.controller";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [DbModule, AuthModule],
    providers: [UsersService],
    controllers: [UsersManagementController, UsersController],
    exports: [UsersService]
})
export class UsersModule {}
