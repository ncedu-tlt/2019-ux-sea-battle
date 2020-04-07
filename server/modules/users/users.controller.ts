import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UseGuards
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { UserDTO } from "../../../common/dto/user.dto";
import { UserUpdateDto } from "../../../common/dto/user-update.dto";
import { UserCreateDto } from "../../../common/dto/user-create.dto";
import { Roles } from "./guard/role.decorator";
import { RoleEnum } from "../db/domain/role.enum";
import { RolesGuard } from "./guard/roles.guard";
import { AuthGuard } from "@nestjs/passport";

@Controller("/api/users")
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get()
    @Roles(RoleEnum.ADMIN)
    @UseGuards(AuthGuard("jwt"), RolesGuard)
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
    @UseGuards(AuthGuard("jwt"), RolesGuard)
    async getUser(@Param("id") id): Promise<UserDTO> {
        return await this.usersService.getUser(id);
    }

    @Post("/create")
    @Roles(RoleEnum.ADMIN)
    @UseGuards(AuthGuard("jwt"), RolesGuard)
    create(@Body() user: UserCreateDto): Promise<void> {
        return this.usersService.createUser(user);
    }

    @Put(":id/update")
    @Roles(RoleEnum.ADMIN)
    @UseGuards(AuthGuard("jwt"), RolesGuard)
    async update(
        @Param("id") id,
        @Body() userData: UserUpdateDto
    ): Promise<void> {
        userData.id = Number(id);
        await this.usersService.update(userData);
    }

    @Delete(":id/delete")
    @Roles(RoleEnum.ADMIN)
    @UseGuards(AuthGuard("jwt"), RolesGuard)
    async delete(@Param("id") id): Promise<void> {
        await this.usersService.delete(id);
    }
}
