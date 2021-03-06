import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { UserDTO } from "../../../common/dto/user.dto";
import { UpdateUserDto } from "../../../common/dto/update-user.dto";
import { CreateUserDto } from "../../../common/dto/create-user.dto";
import { Roles } from "../../decorators/role.decorator";
import { RoleEnum } from "../db/domain/role.enum";

@Controller("/api/management/users")
export class UsersManagementController {
    constructor(private usersService: UsersService) {}

    @Get()
    @Roles(RoleEnum.ADMIN)
    async getAll(): Promise<UserDTO[]> {
        const users = await this.usersService.getAll();
        return users.map(user => ({
            id: user.id,
            nickname: user.nickname,
            email: user.email,
            avatarUrl: user.avatarUrl,
            role: user.role,
            balance: user.balance,
            experience: user.experience,
            isAnon: user.isAnon,
            status: user.status
        }));
    }

    @Get(":id")
    @Roles(RoleEnum.ADMIN)
    async getUser(@Param("id") id): Promise<UserDTO> {
        return await this.usersService.getUser(id);
    }

    @Post()
    @Roles(RoleEnum.ADMIN)
    async create(@Body() user: CreateUserDto): Promise<UserDTO> {
        const created = await this.usersService.createUser(user);
        return {
            id: created.id,
            nickname: created.nickname,
            email: created.email,
            avatarUrl: created.avatarUrl,
            role: created.role,
            balance: created.balance,
            experience: created.experience,
            isAnon: created.isAnon,
            status: created.status
        };
    }

    @Patch(":id")
    @Roles(RoleEnum.ADMIN)
    async update(
        @Param("id") id,
        @Body() userData: UpdateUserDto
    ): Promise<UserDTO> {
        userData.id = Number(id);
        const user = await this.usersService.update(userData);
        return {
            id: user.id,
            nickname: user.nickname,
            email: user.email,
            avatarUrl: user.avatarUrl,
            role: user.role,
            balance: user.balance,
            experience: user.experience,
            isAnon: user.isAnon,
            status: user.status
        };
    }

    @Delete(":id")
    @Roles(RoleEnum.ADMIN)
    async delete(@Param("id") id): Promise<void> {
        await this.usersService.delete(id);
    }
}
