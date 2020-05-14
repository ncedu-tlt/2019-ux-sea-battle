import { IsString, IsOptional, IsNumber } from "class-validator";

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
    tags: string[];
}
