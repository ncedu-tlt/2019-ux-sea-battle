import { PageService } from "../shared/page/page.service";
import { Page } from "../shared/page/page";
import { CreatePostDTO } from "./../../../common/dto/create-post.dto";
import { UpdatePostDTO } from "./../../../common/dto/update-post.dto";
import { PostDTO } from "./../../../common/dto/post.dto";
import { PostDAO } from "./../db/domain/post.dao";
import { Injectable, HttpStatus, HttpException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DeleteResult } from "typeorm";

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(PostDAO)
        private postsRepository: Repository<PostDAO>,
        private pageService: PageService
    ) {}

    async getPosts(range: string): Promise<Page<PostDAO>> {
        const postsPage = await this.pageService.getItems<PostDAO>(
            range,
            limit => this.postsRepository.find(limit)
        );
        return postsPage;
    }

    create(post: CreatePostDTO, user): Promise<PostDAO> {
        const newPost: PostDTO = {
            ...post,
            createdAt: new Date(),
            author: user
        };
        return this.postsRepository.save(newPost);
    }

    async update(post: UpdatePostDTO): Promise<PostDAO> {
        await this.postsRepository.update(post.id, post);
        return await this.postsRepository.findOne(post.id);
    }

    async delete(id: number): Promise<DeleteResult> {
        const post = await this.postsRepository.findOne(id);
        if (!post) {
            throw new HttpException(
                "posts/postDoesNotExists",
                HttpStatus.NOT_FOUND
            );
        }
        return this.postsRepository.delete(id);
    }
}
