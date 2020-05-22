import { PostDTO } from "./../../../common/dto/post.dto";
import { PostDAO } from "./../db/domain/post.dao";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ConverterService {
    getConvertedPost(post: PostDAO): PostDTO {
        return {
            id: post.id,
            title: post.title,
            shortText: post.shortText,
            fullText: post.fullText,
            createdAt: post.createdAt,
            tags: post.tags,
            author: post.author
        };
    }
}
