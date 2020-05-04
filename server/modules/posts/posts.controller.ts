import { AuthGuard } from "@nestjs/passport";
import { CreatePostDTO } from "./../../../common/dto/create-post.dto";
import { UpdatePostDTO } from "./../../../common/dto/update-post.dto";
import { PostsService } from "./posts.service";
import { PostDTO } from "../../../common/dto/post.dto";
import {
    Controller,
    Post,
    Body,
    Patch,
    Param,
    UseGuards,
    Request
} from "@nestjs/common";

@Controller("/api/posts")
export class PostsController {
    constructor(private postsService: PostsService) {}

    @UseGuards(AuthGuard())
    @Post()
    /* @Roles(RoleEnum.ADMIN) */
    async create(
        @Request() req,
        @Body() post: CreatePostDTO
    ): Promise<PostDTO> {
        const user = req.user;
        const newPost = {
            ...post,
            author: user
        };
        const createdPost = await this.postsService.create(newPost);
        return {
            id: createdPost.id,
            title: createdPost.title,
            shortText: createdPost.shortText,
            fullText: createdPost.fullText,
            createdAt: createdPost.createdAt,
            tags: createdPost.tags,
            author: createdPost.author
        };
    }

    @Patch(":id")
    /* @Roles(RoleEnum.ADMIN) */
    async update(
        @Param("id") id,
        @Body() post: UpdatePostDTO
    ): Promise<PostDTO> {
        post.id = Number(id);
        const updated = await this.postsService.update(post);
        return {
            id: updated.id,
            title: updated.title,
            shortText: updated.shortText,
            fullText: updated.fullText,
            createdAt: updated.createdAt,
            tags: updated.tags,
            author: updated.author
        };
    }
}
