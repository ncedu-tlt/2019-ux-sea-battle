import { SharedModule } from "../shared/shared.module";
import { AuthModule } from "./../auth/auth.module";
import { PostsController } from "./posts.controller";
import { PostsService } from "./posts.service";
import { PostsConversionService } from "./posts-conversion.service";
import { Module } from "@nestjs/common";
import { DbModule } from "../db/db.module";

@Module({
    imports: [DbModule, AuthModule, SharedModule],
    providers: [PostsService, PostsConversionService],
    controllers: [PostsController]
})
export class PostsModule {}
