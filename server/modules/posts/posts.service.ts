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
        private postsRepository: Repository<PostDAO>
    ) {}

    async getPosts(range: string): Promise<[PostDAO[], string]> {
        const ranges = range.split("-", 2);
        const begin = parseInt(ranges[0]);
        const end = parseInt(ranges[1]);

        const result = await this.postsRepository.find({
            take: end - begin,
            skip: begin > 0 ? begin - 1 : begin
        });

        const resRange = begin + "-" + end + "/" + result.length;
        return [result, resRange];
    }

    create(post: PostDTO): Promise<PostDAO> {
        return this.postsRepository.save(post);
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
