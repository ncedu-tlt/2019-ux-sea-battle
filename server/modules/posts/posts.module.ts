import { AuthModule } from "./../auth/auth.module";
import { PostsController } from "./posts.controller";
import { PostsService } from "./posts.service";
import { Module } from "@nestjs/common";
import { DbModule } from "../db/db.module";

@Module({
    imports: [DbModule, AuthModule],
    providers: [PostsService],
    controllers: [PostsController]
})
export class PostsModule {}
