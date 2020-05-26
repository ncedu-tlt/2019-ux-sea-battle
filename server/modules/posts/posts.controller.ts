import { AuthGuard } from "@nestjs/passport";
import { CreatePostDTO } from "./../../../common/dto/create-post.dto";
import { UpdatePostDTO } from "./../../../common/dto/update-post.dto";
import { PostsService } from "./posts.service";
import { PostsConversionService } from "./posts-conversion.service";
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
import { Page } from "../shared/page/page";

@Controller("/api/posts")
export class PostsController {
    constructor(
        private postsService: PostsService,
        private pageService: PageService,
        private postsConversionService: PostsConversionService
    ) {}

    @Get()
    async get(
        @Headers("range") range: string,
        @Response() res: ResponseType
    ): Promise<ResponseType> {
        if (range) {
            const postsPage = await this.postsService.getPosts(range);

            const convertedPage = new Page<PostDTO>();
            convertedPage.begin = postsPage.begin;
            convertedPage.end = postsPage.end;
            convertedPage.items = postsPage.items.map(post =>
                this.postsConversionService.convertDaoToDto(post)
            );

            return this.pageService.sendResponse(res, convertedPage);
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
        return this.postsConversionService.convertDaoToDto(createdPost);
    }

    @Patch(":id")
    @Roles(RoleEnum.ADMIN)
    async update(
        @Param("id") id: string,
        @Body() post: UpdatePostDTO
    ): Promise<PostDTO> {
        post.id = Number(id);
        const updatedPost = await this.postsService.update(post);
        return this.postsConversionService.convertDaoToDto(updatedPost);
    }

    @Delete(":id")
    @Roles(RoleEnum.ADMIN)
    async delete(@Param("id") id: number): Promise<void> {
        await this.postsService.delete(id);
    }
}
