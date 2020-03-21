import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { DbModule } from "../db/db.module";

@Module({
    imports: [DbModule],
    providers: [UsersService]
})
export class UsersModule {}
