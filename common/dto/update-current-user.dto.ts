import {
    IsEmail,
    Length,
    IsOptional,
    IsString,
    IsNumber
} from "class-validator";

export class UpdateCurrentUserDto {
    @IsOptional()
    @IsNumber()
    id: number;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @Length(3, 20)
    nickname?: string;

    @IsOptional()
    @Length(5, 20)
    password?: string;

    @IsOptional()
    @IsString()
    avatarUrl?: string;
}
