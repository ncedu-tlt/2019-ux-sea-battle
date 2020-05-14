import { PostDAO } from "./../db/domain/post.dao";
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
    Request,
    Response,
    Delete,
    Get,
    Headers,
    HttpException,
    HttpStatus
} from "@nestjs/common";
import { Roles } from "server/decorators/role.decorator";
import { RoleEnum } from "../db/domain/role.enum";

@Controller("/api/posts")
export class PostsController {
    constructor(private postsService: PostsService) {}

    @Get()
    async get(@Headers("range") range, @Response() res): Promise<any> {
        if (range) {
            const [posts, resRange] = await this.postsService.getPosts(range);
            res.set("Range", resRange);
            res.send(
                posts.map(post => ({
                    id: post.id,
                    title: post.title,
                    shortText: post.shortText,
                    fullText: post.fullText,
                    createdAt: post.createdAt,
                    tags: post.tags,
                    author: post.author
                }))
            );
        } else {
            throw new HttpException(
                "posts/postsBadRange",
                HttpStatus.BAD_REQUEST
            );
        }
    }

    @UseGuards(AuthGuard())
    @Post()
    @Roles(RoleEnum.ADMIN)
    async create(
        @Request() req,
        @Body() post: CreatePostDTO
    ): Promise<PostDAO> {
        const user = req.user;
        const newPost: PostDTO = {
            ...post,
            createdAt: new Date(),
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
    @Roles(RoleEnum.ADMIN)
    async update(
        @Param("id") id,
        @Body() post: UpdatePostDTO
    ): Promise<PostDAO> {
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

    @Delete(":id")
    @Roles(RoleEnum.ADMIN)
    async delete(@Param("id") id): Promise<void> {
        await this.postsService.delete(id);
    }
}
