import { SharedModule } from "../shared/shared.module";
import { AuthModule } from "./../auth/auth.module";
import { PostsController } from "./posts.controller";
import { PostsService } from "./posts.service";
import { ConverterService } from "./converter.service";
import { Module } from "@nestjs/common";
import { DbModule } from "../db/db.module";

@Module({
    imports: [DbModule, AuthModule, SharedModule],
    providers: [PostsService, ConverterService],
    controllers: [PostsController]
})
export class PostsModule {}
