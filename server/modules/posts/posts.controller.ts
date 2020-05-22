import { AuthGuard } from "@nestjs/passport";
import { CreatePostDTO } from "./../../../common/dto/create-post.dto";
import { UpdatePostDTO } from "./../../../common/dto/update-post.dto";
import { PostsService } from "./posts.service";
import { ConverterService } from "./converter.service";
import { PageService } from "../shared/page/page.service";
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
import { Response as ResponseType, Request as RequestType } from "express";

@Controller("/api/posts")
export class PostsController {
    constructor(
        private postsService: PostsService,
        private pageService: PageService,
        private converterService: ConverterService
    ) {}

    @Get()
    async get(
        @Headers("range") range: string,
        @Response() res: ResponseType
    ): Promise<ResponseType> {
        if (range) {
            const postsPage = await this.postsService.getPosts(range);

            return this.pageService.sendResponse(
                res,
                postsPage.getHeader(),
                postsPage.items.map(post =>
                    this.converterService.getConvertedPost(post)
                )
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
        @Request() req: RequestType,
        @Body() post: CreatePostDTO
    ): Promise<PostDTO> {
        const user = req.user;
        const createdPost = await this.postsService.create(post, user);
        return this.converterService.getConvertedPost(createdPost);
    }

    @Patch(":id")
    @Roles(RoleEnum.ADMIN)
    async update(
        @Param("id") id: string,
        @Body() post: UpdatePostDTO
    ): Promise<PostDTO> {
        post.id = Number(id);
        const updatedPost = await this.postsService.update(post);
        return this.converterService.getConvertedPost(updatedPost);
    }

    @Delete(":id")
    @Roles(RoleEnum.ADMIN)
    async delete(@Param("id") id: number): Promise<void> {
        await this.postsService.delete(id);
    }
}
