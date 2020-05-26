import { IsString, IsOptional, IsArray } from "class-validator";

export class CreatePostDTO {
    @IsString()
    title: string;

    @IsString()
    shortText: string;

    @IsString()
    fullText: string;

    @IsOptional()
    @IsArray()
    tags?: string[];
}
