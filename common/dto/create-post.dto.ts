import { IsString, IsOptional } from "class-validator";

export class CreatePostDTO {
    @IsString()
    title: string;

    @IsString()
    shortText: string;

    @IsString()
    fullText: string;

    @IsOptional()
    tags?: string[];
}
