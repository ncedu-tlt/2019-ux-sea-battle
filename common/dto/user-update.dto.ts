import { RoleEnum } from "../../server/modules/db/domain/role.enum";
import { UserStatusEnum } from "../../server/modules/db/domain/user-status.enum";
import {
    IsEmail,
    Length,
    IsNumber,
    IsOptional,
    IsBoolean,
    IsString,
    IsEnum
} from "class-validator";

export class UserUpdateDto {
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

    @IsOptional()
    @IsEnum(RoleEnum)
    role?: RoleEnum;

    @IsOptional()
    @IsNumber()
    balance?: number;

    @IsOptional()
    @IsNumber()
    experience?: number;

    @IsOptional()
    @IsBoolean()
    isAnon?: boolean;

    @IsOptional()
    @IsEnum(UserStatusEnum)
    status?: UserStatusEnum;
}
