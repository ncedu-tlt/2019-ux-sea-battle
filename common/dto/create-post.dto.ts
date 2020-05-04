import { UserDAO } from "./../../server/modules/db/domain/user.dao";
import { IsString, IsOptional, IsDate } from "class-validator";
import { Type } from "class-transformer";

export class CreatePostDTO {
    @IsString()
    title: string;

    @IsString()
    shortText: string;

    @IsString()
    fullText: string;

    @IsDate()
    @Type(() => Date)
    createdAt: Date;

    @IsOptional()
    @IsString()
    tags?: string;

    author: Promise<UserDAO>;
}
