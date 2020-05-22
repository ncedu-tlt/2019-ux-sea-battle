import { IsString, IsOptional, IsNumber, IsArray } from "class-validator";

export class UpdatePostDTO {
    @IsOptional()
    @IsNumber()
    id: number;

    @IsOptional()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    shortText: string;

    @IsOptional()
    @IsString()
    fullText: string;

    @IsOptional()
    @IsArray()
    tags: string[];
}
